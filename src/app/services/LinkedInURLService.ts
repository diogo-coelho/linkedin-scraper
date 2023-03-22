import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import * as Puppeteer from 'puppeteer'
import date from '../../utils/FormattedDate'
import { ICountryCodes, IDataURL } from '../../types/interfaces'
import LinkedInURLServiceError from '../../errors/LinkedInURLServiceError'
import repository from '../models/URLFromLinkedInRepository'

class LinkedInURLService {
    private _companyName: string
    private _country: ICountryCodes
    private _response: IDataURL[]
    static _urlLinkedinDAO: repository = new repository();

    constructor (companyName: string, country: ICountryCodes) {
        this._companyName = companyName
        this._country = country
        this._response = []
    }

    public async scrapURLFromLinkedIn () : Promise<void> {
        console.log(`[ ${ date.formattedDate } ] : URLDoLinkedinService.scrapURLFromLinkedIn iniciado`);
        fs.appendFileSync(path.join(__dirname, '../logs/companies.log'), 
            `[ ${ date.formattedDate } ] : URLDoLinkedinService.scrapURLFromLinkedIn iniciado \r\n`);

        const browser = await this.launchBrowser()
        try {            
            const page = await browser.newPage()
            await this.searchURL(page)
            const urlArray: IDataURL[] = await this.getResults(page)

            if (urlArray.length === 0)
                throw new LinkedInURLServiceError(404,  `Nenhuma URL do Linkedin não foi encontrada`)

            await this.saveURLFromLinkedIn(urlArray)

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

    private async getResults (page: Puppeteer.Page): Promise<IDataURL[]> {
        return await page.waitForSelector('.rc > div, .g > div', { timeout: 30000 })
            .then(async () => {
                return await page.evaluate(() => {
                    const data: IDataURL[] = []
                    const elements: NodeListOf<Element> = document.querySelectorAll('.rc > div, .g > div')
                    if (elements.length === 0) throw new Error('Nenhum link encontrado')
                    
                    for (const element of elements) {
                        if ((element.querySelector('a')?.href.indexOf(`linkedin.com/company`) !== -1 || 
                             element.querySelector('a')?.href.indexOf(`linkedin.com/school`) !== -1) && 
                             element.querySelector('a')?.href.indexOf(`linkedin.com/showcase`) === -1 && 
                             element.querySelector('a')?.href.indexOf(`linkedin.com/company/linkedin`) === -1 && 
                             element.querySelector('a')?.href.indexOf(`pulse-news`) === -1 && 
                             element.querySelector('a')?.href.indexOf(`/life`) === -1 && 
                             element.querySelector('a')?.href.indexOf(`/jobs`) === -1 && 
                             element.querySelector('a')?.href.indexOf(`/people`) === -1 && 
                             element.querySelector('a')?.href.indexOf(`/about`) === -1) {
                                
                            data.push({ 
                                companyName: element.querySelector('h3')?.innerText as string, 
                                href: element.querySelector('a')?.href as string
                            })
                        }
                    }

                    return data
                })
            })
            .catch((err: Error) => {
                throw new LinkedInURLServiceError(404, `Ocorreu um erro na captação dos websites do Linkedin: ${ err }`)
            })
    }

    private async saveURLFromLinkedIn (urlArray: IDataURL[]): Promise<void> {
        try {
            for (const url of urlArray) {
                url.href = url.href?.replace(/^(http|https)(:\/\/)(\w){0,3}(.){0,1}(linkedin.com\/)/g, `https://${ this._country.code.toLowerCase() }.linkedin.com/`)
                url.href = url.href?.match(/(http|https):\/\/(.{2})(\.linkedin\.com\/company\/|\.linkedin\.com\/school\/)(.[^/]+)/)![0] 

                if (url.href.indexOf('?') !== -1)
                    url.href = url.href.replace(url.href.substring(url.href.indexOf('?'), url.href.length), '').trim()

                if (!this._response.some((u: IDataURL) => u.href === url.href)) {
                    console.log(`[ ${ date.formattedDate } ] : empresa: ${ this._companyName }, pais: ${ this._country.code } :: Objeto URL Linkedin { empresa: ${ url.companyName }, href: ${ url.href } }`)
                    fs.appendFileSync(path.join(__dirname, '../logs/companies.log'), 
                        `[ ${ date.formattedDate } ] : empresa: ${ this._companyName }, pais: ${ this._country.code } :: Objeto URL Linkedin { empresa: ${ url.companyName }, href: ${ url.href } } \r\n`)

                    const response = await LinkedInURLService._urlLinkedinDAO.model.find({ href: url.href })
                    if (response.length === 0) {
                        await LinkedInURLService._urlLinkedinDAO.model.create({
                            ...url,
                            created_at: new Date(),
                            updated_at: new Date()
                        })
                        this._response.push(url)
                    } else {
                        this._response.push({ companyName: response[0].companyName, href: response[0].href })
                    }
                }
            }
        } catch (err: unknown) {
            throw new LinkedInURLServiceError(404, `Ocorreu um erro ao tentar salvar os dados no Mongoose: ${ err }`)
        }
    }
}

export default LinkedInURLService