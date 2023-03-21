'use strict'

import { model, Schema, Model } from 'mongoose'
import { IURLFromLinkedInDAO } from '../../types/interfaces'

class URLFromLinkedInDAO {
    private _schema: Schema<IURLFromLinkedInDAO>
    private _model: Model<IURLFromLinkedInDAO>

    constructor () {
        this._schema = this.initSchema()
        this._model = model('Url_linkedin', this._schema)
    }

    private initSchema (): Schema<IURLFromLinkedInDAO> {
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

    public get model (): Model<IURLFromLinkedInDAO> {
        return this._model
    }
}

export default URLFromLinkedInDAO