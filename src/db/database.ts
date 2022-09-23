import {Pool} from 'pg'
import {throwError} from '../error'

/**
 * Singleton to support lazy connection and environment setting
 */
export class Database {
    private static instance: Pool

    static pool(): Pool {
        if (!this.instance) {
            this.instance = createPool()
        }

        return this.instance
    }

    static reset(): void {
        this.instance = createPool()
    }
}

function createPool(): Pool {
    const dbUsername =
        process.env.databaseUser ??
        throwError('Missing env variable databaseUser')
    const dbPassword =
        process.env.databasePassword ??
        throwError('Missing env variable databasePassword')
    const dbName =
        process.env.databaseName ??
        throwError('Missing env variable databaseName')
    const dbHost =
        process.env.databaseHost ??
        throwError('Missing env variable databaseHost')
    const dbPort = parseInt(
        process.env.databasePort ??
            throwError('Missing env variable databasePort')
    )

    return new Pool({
        host: dbHost,
        database: dbName,
        port: dbPort,
        user: dbUsername,
        password: dbPassword,
        idleTimeoutMillis: 1000,
        connectionTimeoutMillis: 1000
    })
}
