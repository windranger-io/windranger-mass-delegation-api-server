import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from 'aws-lambda/trigger/api-gateway-proxy'
import {Context} from 'aws-lambda'
import {log} from '../config/logging'
import {Database} from './db/database'
import {throwError} from './error'
import { String } from 'aws-sdk/clients/codepipeline'

/**
 * Shape of the AWS Gateway event the handler has available
 * https://github.com/awsdocs/aws-lambda-developer-guide/blob/main/sample-apps/nodejs-apig/event.json
 */

export const handlerVotingPower = async (
    event: APIGatewayProxyEvent,
    context: Context
    // eslint-disable-next-line @typescript-eslint/require-await
): Promise<APIGatewayProxyResult> => {
    log.info(
        'handler id: %s, name: %s',
        context.awsRequestId,
        context.functionName
    )

    const reqBody = event.body || ''

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const obj: {[id: string]: string | string[] | number} = JSON.parse(reqBody)

    const addresses: string[] =
        (obj.addresses as string[]) ??
        (throwError('Missing body "addresses" parameter') as unknown)

    const scores = []
    for (const addr of addresses) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const addrDict: {[id: string]: string | number} = {address: addr}
        addrDict.score = 1
        scores.push(addrDict)
    }
    const resp = {score: scores}
    return {
        statusCode: 200,
        body: JSON.stringify(resp)
    }
}

export const handlerMassDelegate = async (
    event: APIGatewayProxyEvent,
    context: Context
    // eslint-disable-next-line @typescript-eslint/require-await
): Promise<APIGatewayProxyResult> => {
    log.info(
        'handler id: %s, name: %s',
        context.awsRequestId,
        context.functionName
    )

    const reqBody = event.body || ''

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const obj: {[id: string]: string | string[] | number | any} =
        JSON.parse(reqBody)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const delegateesLen = obj.content.delegatees.length as number
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const delegator: string = obj.content.delegator as string
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const blockNumber: number = obj.content.snapshot as number

    const resp = {
        status: 'ok',
        blockNumber,
        delegator,
        numberOfDelegatees: delegateesLen.toString()
    }
    return {
        statusCode: 200,
        body: JSON.stringify(resp)
    }
}

export const handler = async (
    event: APIGatewayProxyEvent,
    context: Context
    // eslint-disable-next-line @typescript-eslint/require-await
): Promise<APIGatewayProxyResult> => {
    log.info(
        'handler id: %s, name: %s',
        context.awsRequestId,
        context.functionName
    )

    const queryStringParameters =
        event.queryStringParameters ??
        throwError('Missing query string parameters')

    const address =
        queryStringParameters.tokenAddress ??
        throwError('Missing tokenAddress parameter')

    const result = await Database.pool().query({
        name: 'fetch-delegation-by-token-address',
        text: 'SELECT * FROM delegation WHERE token_address = $1',
        values: [address]
    })

    const rows = result.rows
    const method = event.httpMethod
    const path = event.path

    if (method === 'POST' && path === '/voting-power') {
        return handlerVotingPower(event, context)
    } else if (method === 'POST' && path === '/mass-delegate') {
        return handlerMassDelegate(event, context)
    }

    return {
        statusCode: 200,
        body: `Method: "${method.toString()}" Path: "${path.toString()}" Queries: ${rows.toString()}`
    }
}
