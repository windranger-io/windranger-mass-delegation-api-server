import {expect} from 'chai'
import {handler} from '../src/handler'
import {APIGatewayProxyEvent} from 'aws-lambda/trigger/api-gateway-proxy'
import {Context} from 'aws-lambda'
import {mock, instance, when} from 'ts-mockito'

describe('Lambda', () => {
    it('parses query parameters', () => {
        const event = mock<APIGatewayProxyEvent>()
        when(event.queryStringParameters).thenReturn({
            ['first']: 'one',
            ['second']: 'two'
        })

        const context = mock<Context>()
        when(context.awsRequestId).thenReturn('199')
        when(context.functionName).thenReturn('The best handler ever!')

        const result = await handler(instance(event), instance(context))

        expect(result).deep.equals({
            statusCode: 200,
            body: 'Queries: {"first":"one","second":"two"}'
        })
    })
})
