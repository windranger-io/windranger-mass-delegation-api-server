import {Pool} from 'pg'
const dbUsername = process.env.databaseUser
const dbPassword = process.env.databasePassword
const dbName = process.env.databaseName
const dbHost = process.env.databaseHost
const dbPort = parseInt(process.env.databasePort)

export const pool = new Pool({
    host: dbHost,
    database: dbName,
    port: dbPort,
    user: dbUsername,
    password: dbPassword
})
