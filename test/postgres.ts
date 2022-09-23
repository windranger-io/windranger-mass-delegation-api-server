import {Client, ClientConfig} from 'pg'
import {Database} from '../src/db/database'
import fs from 'fs'

const dbUser = 'unit_test_user'
const dbPassword = 'unit-test-p@ssw0rd'
const dbName = 'massdelegation'
const dbHost = 'localhost'
const dbPort = 5432
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

export async function createMassDelegationDatabase(): Promise<void> {
    await query(postgresDB, `CREATE DATABASE ${dbName}`)

    // Process.env is used by the Lambda's connection utility
    process.env = {...env}
    process.env.databaseUser = dbUser
    process.env.databasePassword = dbPassword
    process.env.databaseName = dbName
    process.env.databaseHost = dbHost
    process.env.databasePort = dbPort.toString()

    await createMassDelegationTables(massDelegationDB)

    await Database.reset()
}

export async function dropMassDelegationDatabase() {
    process.env = env

    // Close off all connections in the Lambda's connection Pool
    await Database.pool().end()

    // Clean up (remove) the test data
    await query(postgresDB, `DROP DATABASE ${dbName}`)
}

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
