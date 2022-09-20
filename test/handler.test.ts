import {expect} from 'chai'
import {handler} from '../src/handler'
import {APIGatewayProxyEvent} from 'aws-lambda/trigger/api-gateway-proxy'
import {Context} from 'aws-lambda'
import {mock, instance, when} from 'ts-mockito'
import {Client, ClientConfig} from 'pg'
import * as fs from 'fs'
import {Database} from '../src/db/database'

const dbUser = 'unit_test_user'
const dbPassword = 'unit-test-p@ssw0rd'
const dbName = 'massdelegation'
const dbHost = 'localhost'
const dbPort = 5432

describe('Lambda', () => {
    const env = process.env
    const postgresDB: ClientConfig = {
        user: dbUser,
        password: dbPassword,
        database: 'postgres',
        host: dbHost,
        port: dbPort
    }
    const massDelegationDB: ClientConfig = {
        user: dbUser,
        password: dbPassword,
        database: dbName,
        host: dbHost,
        port: dbPort
    }

    before(async () => {
        await query(postgresDB, `CREATE DATABASE ${dbName}`)

        process.env = {...env}
        process.env.databaseUser = dbUser
        process.env.databasePassword = dbPassword
        process.env.databaseName = dbName
        process.env.databaseHost = dbHost
        process.env.databasePort = dbPort.toString()

        await createMassDelegationTables(massDelegationDB)
    })

    after(async () => {
        process.env = env

        // Close off all connections in the Lambda's connection Pool
        await Database.pool().end()

        // Clean up (remove) the test data
        await query(postgresDB, `DROP DATABASE ${dbName}`)
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

        // TODO populate with test data for comparision!
        expect(result).deep.equals({
            statusCode: 200,
            body: 'Queries: '
        })
    })
})

async function query(dbConfig: ClientConfig, sql: string): Promise<void> {
    const db = new Client(dbConfig)
    await db.connect()
    await db.query(sql)
    await db.end()
}

async function createMassDelegationTables(
    dbConfig: ClientConfig
): Promise<void> {
    await query(
        dbConfig,
        fs.readFileSync('./scripts/sql/create_tables.sql', 'utf8')
    )
}
