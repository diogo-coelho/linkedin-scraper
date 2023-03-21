'use strict'

import { Router, Request, Response } from 'express'
import CompanyController from '../app/controllers/CompanyController'

export class CompanyRouter {
    private _router: Router;

    constructor() {
        this._router = Router();
        this.init();
    }

    public get router () : Router {
        return this._router;
    }

    private init () : void {
        this._router.post('/', this.postCrawler);
    }

    private postCrawler (req: Request, resp: Response) {
        const companyController = new CompanyController();
        companyController.scrap(req, resp);
    }
}

const companyRouter = new CompanyRouter();
export default companyRouter.router;