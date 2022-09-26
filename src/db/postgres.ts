import {Client, ClientConfig} from 'pg'
import {Database} from './database'
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

    Database.reset()
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

async function queryWithParams(
    dbConfig: ClientConfig,
    sql: string,
    params?: any[]
): Promise<void> {
    let queryParams = []
    if (typeof params === 'undefined') {
        queryParams = []
    } else {
        queryParams = params
    }
    const db = new Client(dbConfig)
    await db.connect()
    await db.query(sql, queryParams)
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

export async function insertDelegateDb(
    network: number,
    tokenAddress: string,
    delegator: string,
    delegatee: string,
    weight: number,
    totalWeight: number,
    blockNumber: number
): Promise<void> {
    const textQuery = `INSERT INTO delegation
    (network, token_address, delegator_address, delegatee_address,
    proof, delegated_weight, total_weight, delegated_block) 
    VALUES 
    ($1, decode($2,'hex'), decode($3,'hex'), decode($4,'hex'), $5, $6, $7, $8 ) RETURNING *`
    await queryWithParams(massDelegationDB, textQuery, [
        network,
        tokenAddress.slice(2),
        delegator.slice(2),
        delegatee.slice(2),
        '',
        weight,
        totalWeight,
        blockNumber
    ])
}
