'use strict'

import { model, Schema, Model } from 'mongoose'
import { IURLFromLinkedInRepository } from '../../types/interfaces'

class URLFromLinkedInRepository {
    private _schema: Schema<IURLFromLinkedInRepository>
    private _model: Model<IURLFromLinkedInRepository>

    constructor () {
        this._schema = this.initSchema()
        this._model = model('Url_linkedin', this._schema)
    }

    private initSchema (): Schema<IURLFromLinkedInRepository> {
        return new Schema({
            companyName: {
                type: String,
                required: true
            },
            href: {
                type: String,
                required: true
            },
            created_at: {
                type: Date,
                required: true
            },
            updated_at: {
                type: Date,
                required: true
            }
        })
    }

    public get model (): Model<IURLFromLinkedInRepository> {
        return this._model
    }
}

export default URLFromLinkedInRepository