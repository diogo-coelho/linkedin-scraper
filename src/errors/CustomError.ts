'use strict'

class CustomError extends Error {
    private _message: string
    private _status: number

    constructor (status: number, message: string) {
        super(message)
        this._status = status
        this._message = this.init(message)
    }

    private init (message: string) : string {
        switch(this._status) {
            case 400: 
                return `ERR_BAD_REQUEST: ${ message }`
    
            case 404: 
                return `ERR_NOT_FOUND: ${ message }`
    
            case 500: 
                return `ERR_INTERNAL_SERVER: ${ message }`
    
            case 503: 
                return `ERR_SERVICE_UNAVAILABLE: ${ message }`
            default:
                return `UNKNOWN ERROR: ${ message }`
        }
    }

    public get status (): number {
        return this._status
    }

    public get message (): string {
        return this._message
    }
}

export default CustomError