import {expect} from 'chai'
import {handler} from '../src/handler'
import {APIGatewayProxyEvent} from 'aws-lambda/trigger/api-gateway-proxy'
import {Context} from 'aws-lambda'
import {mock, instance, when} from 'ts-mockito'

describe('Lambda', () => {
    const env = process.env

    before(() => {
        process.env = {...env}
        process.env.databaseUser = 'db-user'
        process.env.databasePassword = 'p@ssw0rd'
        process.env.databaseName = 'mass-delegation'
        process.env.databaseHost = 'db-host'
        process.env.databasePort = '1237'
    })

    after(() => {
        process.env = env
    })

    it('parses query parameters', async () => {
        const event = mock<APIGatewayProxyEvent>()
        when(event.queryStringParameters).thenReturn({
            ['tokenAddress']: 'one'
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
