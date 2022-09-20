import {expect} from 'chai'
import {handler} from '../src/handler'
import {APIGatewayProxyEvent} from 'aws-lambda/trigger/api-gateway-proxy'
import {Context} from 'aws-lambda'
import {mock, instance, when} from 'ts-mockito'
import {Pool} from 'pg'

const dbUser = 'unit_test_user'
const dbPassword = 'unit-test-p@ssw0rd'
const dbName = 'MassDelegation'
const dbHost = 'localhost'

describe('Lambda', () => {
    const env = process.env
    const postgres = new Pool({
        user: dbUser,
        password: dbPassword,
        database: 'postgres',
        host: dbHost,
        port: 5432
    })

    before(async () => {
        await postgres.query('  CREATE DATABASE MassDelegation')

        process.env = {...env}
        process.env.databaseUser = dbUser
        process.env.databasePassword = dbPassword
        process.env.databaseName = dbName
        process.env.databaseHost = dbHost
        process.env.databasePort = '5432'
    })

    after(async () => {
        process.env = env

        await postgres.query('DROP DATABASE MassDelegation')
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
