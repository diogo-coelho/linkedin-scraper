'use strict'

import CustomError from "./CustomError"

class LinkedInURLServiceError extends CustomError {
    constructor(status: number, message: string) {
        super(status, message)
    }
}

export default LinkedInURLServiceError