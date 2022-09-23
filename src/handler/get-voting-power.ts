import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from 'aws-lambda/trigger/api-gateway-proxy'
import {Context} from 'aws-lambda'
import {log} from '../../config/logging'
import {Database} from '../db/database'
import {throwError} from '../error'
import {getCombinedVotingPowerOf} from '../blockchain'

/**
 * Shape of the AWS Gateway event the handler has available
 * https://github.com/awsdocs/aws-lambda-developer-guide/blob/main/sample-apps/nodejs-apig/event.json
 */
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

    const reqBody = event.body || ''

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const obj: {[id: string]: string | string[] | number} = JSON.parse(reqBody)

    const addresses: string[] =
        (obj.addresses as string[]) ??
        (throwError('Missing body "addresses" parameter') as unknown)

    // const result = await Database.pool().query({
    //     name: 'fetch-delegation-by-token-address',
    //     text: 'SELECT * FROM delegation WHERE token_address = $1',
    //     values: ['0x']
    // })

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const blockNumber: number = obj.snapshot as number

    const scores = []
    for (const addr of addresses) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const addrDict: {[id: string]: string | number} = {address: addr}
        addrDict.score = await getCombinedVotingPowerOf(addr, blockNumber)
        scores.push(addrDict)
    }
    const resp = {score: scores}
    return {
        statusCode: 200,
        body: JSON.stringify(resp)
    }
}
