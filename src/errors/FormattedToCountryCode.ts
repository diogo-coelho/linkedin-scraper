'use strict'

import CustomError from "./CustomError"

class FormattedToCountryCodeError extends CustomError {
    constructor(status: number, message: string) {
        super(status, message)
    }
}

export default FormattedToCountryCodeError