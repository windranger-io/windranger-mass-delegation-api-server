import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from 'aws-lambda/trigger/api-gateway-proxy'
import {Context} from 'aws-lambda'
import {log} from '../config/logging'
import {Database} from './db/database'
import {throwError} from './error'

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

    const queryStringParameters =
        event.queryStringParameters ??
        throwError('Missing query string parameters')

    const address =
        queryStringParameters.tokenAddress ??
        throwError('Missing tokenAddress parameter')

    const result = await Database.pool().query({
        name: 'fetch-delegation-by-token-address',
        text: 'SELECT * FROM Delegation WHERE token_address = $1',
        values: [address]
    })

    const rows = result.rows

    return {
        statusCode: 200,
        body: `Queries: ${rows.toString()}`
    }
}
