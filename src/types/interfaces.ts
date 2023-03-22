import { Document } from 'mongoose'

export type IRequestBody = {
    companyName: string,
    country: ICountryCodes
}

export type ICountryCodes = {
    code: string,
    list: string[]
}

export type IDataURL = {
    companyName: string,
    href: string
}

export interface IURLFromLinkedInRepository extends Document {
    _id?: string,
    companyName: string,
    href: string,
    created_at?: Date,
    updated_at?: Date
}