declare global {
    namespace NodeJS {
        interface ProcessEnv {
            databaseUser: string
            databasePassword: string
            databaseName: string
            databaseHost: string
            databasePort: string
        }
    }
}

export {}
