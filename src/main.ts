'use strict'

import fs from 'fs'
import path from 'path'
import * as http from 'http'

import date from './utils/FormattedDate'
import Server from './config/Server'

const httpServer = new Server()

function onError (error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error
    const bind = (typeof httpServer.port === 'string') ? `Pipe ${ httpServer.port }` : `Porta ${ httpServer.port }`
    switch (error.code) {
        case 'EACCESS': 
            httpServer.closeDatabase()

            console.error(`[ ${ date.formattedDate } ] : ${ bind } requer privilégios elevados de acesso`)
            fs.appendFileSync(path.join(__dirname, `../logs/error.log`), 
                `[ ${ date.formattedDate } ] : ${ bind } requer privilégios elevados de acesso \r\n`)
            process.exit(1)
            break
        
        case 'EADDRIUSE': 
            httpServer.closeDatabase()

            console.error(`[ ${ date.formattedDate } ] : ${ bind } já está em uso`)
            fs.appendFileSync(path.join(__dirname, `../logs/error.log`), 
                `[ ${ date.formattedDate } ] : ${ bind } já está em uso \r\n`)

        default:
            httpServer.closeDatabase()
            throw error
    }
}

function onListening (server: http.Server) {
    const address = server.address()
    const bind = (typeof address === 'string') ? `pipe ${ address }` : `porta ${ address?.port }`
    
    console.log(`[ ${ date.formattedDate } ] : Servidor rodando na ${ bind }`);
    fs.appendFileSync(path.join(__dirname, '../logs/server.log'),
        `[ ${ date.formattedDate } ] : Servidor rodando na ${ bind } \r\n`);
}

httpServer.server.then((server: http.Server) => {
    server.listen(httpServer.port)
    server.on('error', onError)
    server.on('listening', () => onListening(server))
    server.setTimeout(0)
})
.catch((err: any) => {
    console.log(`[ ${ date.formattedDate } ] : Não foi possível inicializar o servidor ${ err.stack }`)
    fs.appendFileSync(path.join(__dirname, '../logs/error.log'), 
        `[ ${ date.formattedDate } ] : Não foi possível inicializar o servidor ${ err.stack } \r\n`);
})
