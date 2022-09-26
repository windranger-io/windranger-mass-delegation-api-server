import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from 'aws-lambda/trigger/api-gateway-proxy'
import {Context} from 'aws-lambda'
import {log} from '../../config/logging'

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
        'massDelegation id: %s, name: %s',
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
