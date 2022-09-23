import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from 'aws-lambda/trigger/api-gateway-proxy'
import {Context} from 'aws-lambda'
import {log} from '../../config/logging'
import {throwError} from '../error'
import {getCombinedVotingPowerOf} from '../blockchain'
import {getCombinedVotingPowerOfMock} from '../../test/blockchainMock'

export const getPriorVotingPowerOfImpl = async (
    walletAddress: string,
    blockNumber: number,
    useMocked: boolean
): Promise<number> => {
    let retValue: number
    if (useMocked) {
        retValue = await getCombinedVotingPowerOfMock(
            walletAddress,
            blockNumber
        )
    } else {
        retValue = await getCombinedVotingPowerOf(walletAddress, blockNumber)
    }
    return retValue
}

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
        'getVotingPower id: %s, name: %s',
        context.awsRequestId,
        context.functionName
    )

    const queryStringParameters =
        event.queryStringParameters ??
        throwError('Missing query string parameters')

    const useMockedBlockchain =
        queryStringParameters.useMockedBlockchain?.toLowerCase() === 'true' ||
        false

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
        addrDict.score = await getPriorVotingPowerOfImpl(
            addr,
            blockNumber,
            useMockedBlockchain
        )
        scores.push(addrDict)
    }
    const resp = {score: scores}
    return {
        statusCode: 200,
        body: JSON.stringify(resp)
    }
}
