'use strict'

import path from 'path';
import fs from 'fs'
import date from '../../utils/FormattedDate'
import { Request, Response } from 'express'

import { IRequestBody } from '../../types/interfaces'
import FormattedCompanyName from '../../utils/FormattedCompanyName';
import FormattedToCountryCode from '../../utils/FormattedToCountryCode';
import LinkedInURLService from '../services/LinkedInURLService';

class CompanyController {
    public async scrap (req: Request, res: Response): Promise<void> {
        try {
            console.log(`[ ${ date.formattedDate } ] : Nova requisição iniciada`);
            fs.appendFileSync(path.join(__dirname, '../logs/companies.log'), 
                `[ ${ date.formattedDate } ] : Nova requisição iniciada \r\n`);

            const requestBody: IRequestBody = {
                companyName: new FormattedCompanyName(req.body.companyName).formatCompanyName(),
                country: new FormattedToCountryCode(req.body.country).formatCountry()
            }
            
            const linkedInURLService = new LinkedInURLService(requestBody.companyName, requestBody.country)
            const foundURLs = await linkedInURLService.scrapURLFromLinkedIn().then(response => {
                console.log(response)
                
            })

        } catch (error: unknown) {
            console.log(error)
        }
    }
}

export default CompanyController