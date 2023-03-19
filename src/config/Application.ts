'use strict'

import Express from 'express'
import BodyParser from 'body-parser'

class Application {
    private _express: Express.Application

    constructor () {
        this._express = Express()
        this.middleware()
        this.routes()
    }

    public get express (): Express.Application {
        return this._express
    }

    private middleware(): void {
        this._express.use(BodyParser.json())
        this._express.use(BodyParser.urlencoded({ extended: false }))
    }

    private routes (): void {
        const router: Express.Router = Express.Router()
        this._express.use('/', router)
    }
}

export default new Application().express