import {expect} from 'chai'
import {handler} from '../src/handler'
import {
    APIGatewayProxyEvent,
    APIGatewayProxyEventQueryStringParameters
} from 'aws-lambda/trigger/api-gateway-proxy'
import {Context} from 'aws-lambda'
import {mock, instance, when} from 'ts-mockito'

describe('Lambda function', () => {
    it('should return with programming cliché', async () => {
        const event = mock<APIGatewayProxyEvent>()

        const queryParams: APIGatewayProxyEventQueryStringParameters = {}

        when(event.queryStringParameters).thenReturn(queryParams)

        const context = mock<Context>()
        when(context.awsRequestId).thenReturn('199')
        when(context.functionName).thenReturn('The best handler ever!')

        const result = await handler(instance(event), instance(context))

        expect(result).deep.equals({
            statusCode: 200,
            body: `Queries: {}`
        })
    })
})
