'use strict'

import 'dotenv/config'
import fs from 'fs'
import path from 'path'

import mongoose, { Mongoose } from 'mongoose' 
import date from '../utils/FormattedDate'

class Database {
    private _database: Promise<Mongoose>

    constructor () {
        this._database = mongoose.connect(`${ process.env.URL_MONGO_DB }/${ process.env.DATABASE}`)
    }

    public get database (): Promise<Mongoose> {
        return this._database
    }

    public async isConnected (): Promise<void> {
        this._database.then(database => {
            database.connection.on('connected', () => {
                console.log(`[${ date.formattedDate }] : Conexão estabelecida com sucesso`)
                fs.appendFileSync(path.join(__dirname, '../../logs/server.log'), 
                    `[${ date.formattedDate }] : Conexão estabelecida com sucesso \r\n`)
            })
        })

        this._database.then(database => {
            database.connection.on('disconnected', () => {
                console.log(`[ ${ date.formattedDate } ] : Conexão desconectada`)
                fs.appendFileSync(path.join(__dirname, '../../logs/server.log'), 
                    `[${ date.formattedDate }] :  Conexão desconectada \r\n`)
            })
        })

        this._database.then(database => {
            database.connection.on('error', (error: Error) => {
                console.error(`[ ${ date.formattedDate } ] : Erro de conexão => ${ error }`)
                fs.appendFileSync(path.join(__dirname, '../../logs/error.log'), 
                    `[ ${ date.formattedDate } ] : Erro de conexão \r\n`);
            })
        })
    }

    public closeConnection (): void {
        process.on('SIGINT', () => {
            this._database.then(database => {
                database.connection.close()
                console.log(`[ ${ date.formattedDate } ] : Mongoose encerrado`)
                fs.appendFileSync(path.join(__dirname, '../../logs/server.log'), 
                    `[ ${ date.formattedDate } ] : Mongoose encerrado \r\n`);
                process.exit(0);
            })
        })
    }
}

export default new Database()