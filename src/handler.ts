/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from 'aws-lambda/trigger/api-gateway-proxy'
import {Context} from 'aws-lambda'
import {ethers} from 'ethers'
import {log} from '../config/logging'
import {Database} from './db/database'
import {throwError} from './error'
import * as abi from './abi'
import { stringMap } from 'aws-sdk/clients/backup'
import { threadId } from 'worker_threads'


/**
 * Shape of the AWS Gateway event the handler has available
 * https://github.com/awsdocs/aws-lambda-developer-guide/blob/main/sample-apps/nodejs-apig/event.json
 */

const getPriorVotingPowerOf = async (
    walletAddress: string,
    blockNumber: number
): Promise<number> => {
    const provider = new ethers.providers.InfuraProvider(
        'rinkeby',
        'INFURA_KEY'
    )
    // RINKEBY COMP-like token
    const tokenContract: string =
        '0xCB198597184804f175Dc7b562b0b5AF0793e9176' as string
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const contract = new ethers.Contract(
        tokenContract,
        abi.compLikeABI,
        provider
    )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const result: number = parseInt(ethers.utils.formatEther(
        await contract.getPriorVotes(walletAddress, blockNumber)
        ))
    return result
}

const getCombinedVotingPowerOf = async (
    walletAddress: string,
    blockNumber: number
): Promise<number> => {
    const provider = new ethers.providers.AlchemyProvider(
        'rinkeby',
        'WaR_ZIDPaoI8tUUpEYYwIBrRRU26yRWJ'
        // WaR_ZIDPaoI8tUUpEYYwIBrRRU26yRWJ alchemy
        // 890b63f3265f4331ae435bef1c0869b8 infura
    )
    // RINKEBY COMP-like token
    const tokenContract: string =
        '0xCB198597184804f175Dc7b562b0b5AF0793e9176' as string
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const contract = new ethers.Contract(
        tokenContract,
        abi.compLikeABI,
        provider
    )
    let result = 0
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const delegatee: string = await contract.delegates(walletAddress)
    if (delegatee === ethers.constants.AddressZero) {
        result += parseInt(
            ethers.utils.formatEther(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                await contract.balanceOf(walletAddress, {
                    blockTag: blockNumber
                })
            )
        )
    }
    result += parseInt(
        ethers.utils.formatEther(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            await contract.getPriorVotes(walletAddress, blockNumber)
        )
    )
    return result
}

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
