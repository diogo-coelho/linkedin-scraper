'use strict'

import 'dotenv/config'
import * as http from 'http'
import Application from './Application'
import Database from './Database'

class Server {
    private _port: string | boolean | number
    private _server: Promise<http.Server>

    constructor () {
        this._port = this.normalizePort(process.env.PORT || 80)
        this._server = this.configureApplication()
    }

    private configureServer (): void {
        
    }

    private async configureApplication (): Promise<http.Server> {
        return new Promise((resolve, reject) => {
            Database.isConnected().then(async () => {
                Application.set('port', this._port)
                Application.set('database', await Database.database)
                resolve(http.createServer(Application))
            }).catch(err => {
                reject(err)
            })
        })
    }

    private normalizePort (val: number | string): number | string | boolean {
        const port: number = (typeof val === 'string') ? parseInt(val, 10) : val
        if (isNaN(port)) return val
        else if (port >= 0) return port
        else return false
    }

    public get port (): string | number | boolean {
        return this._port
    }

    public get server (): Promise<http.Server> {
        return this._server
    }

    public closeDatabase (): void {
        Application.get('database').closeConnection()
    }
}

export default Server