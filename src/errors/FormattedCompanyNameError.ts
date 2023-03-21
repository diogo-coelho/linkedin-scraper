'use strict'

import CustomError from "./CustomError";

class FormattedCompanyNameError extends CustomError {
    constructor (status: number, message: string) {
        super(status, message)
    }
}

export default FormattedCompanyNameError