import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import date from '../../utils/FormattedDate'
import { ICountryCodes } from '../../types/interfaces'
import * as Puppeteer from 'puppeteer'
import LinkedInURLServiceError from '../../errors/LinkedInURLServiceError'

class LinkedInURLService {
    private _companyName: string
    private _country: ICountryCodes

    constructor (companyName: string, country: ICountryCodes) {
        this._companyName = companyName
        this._country = country
    }

    public async scrapURLFromLinkedIn () : Promise<void> {
        console.log(`[ ${ date.formattedDate } ] : URLDoLinkedinService.scrapURLFromLinkedIn iniciado`);
        fs.appendFileSync(path.join(__dirname, '../logs/companies.log'), 
            `[ ${ date.formattedDate } ] : URLDoLinkedinService.scrapURLFromLinkedIn iniciado \r\n`);

        const browser = await this.launchBrowser()
        try {            
            const page = await browser.newPage()
            await this.searchURL(page)

        } catch (error: unknown) {
            console.log(error)
        } finally {
            browser.close()
        }
    }

    private async launchBrowser (): Promise<Puppeteer.Browser> {
        return await Puppeteer.launch({
            headless: false,
            ignoreHTTPSErrors: true,
            defaultViewport: null,
            args: [
                `--no-sandbox`,
                `--disable-setuid-sandbox`,
                `--ignore-certificate-errors`,
                `--window-size=1300,768`,
            ]
        });
    }

    private async searchURL (page: Puppeteer.Page): Promise<void> {
        try {
            await page.setUserAgent(process.env?.USER_AGENT || '')
            await page.setRequestInterception(true)
            page.on('request', (interceptedRequest: Puppeteer.HTTPRequest) => {
                if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg') || interceptedRequest.resourceType() === "font") {
                    interceptedRequest.abort();
                } else {
                    interceptedRequest.continue();
                }
            })
            await page.goto(`${ process.env.URL_LINKEDIN_SEARCH }?q=site:${ this._country.code }.linkedin.com/company profile ${ this._companyName} ${ this._country.code }`)
        
        } catch (err: unknown) {
            throw new LinkedInURLServiceError(504, `Página sem resposta ${ err }`)
        }
    }
}

export default LinkedInURLService