export type IRequestBody = {
    companyName: string,
    country: ICountryCodes
}

export type ICountryCodes = {
    code: string,
    list: string[]
}

export type IDataURL = {
    empresa: string,
    href: string
}