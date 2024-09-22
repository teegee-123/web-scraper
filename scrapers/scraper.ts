import { Browser, Page } from "puppeteer";
import { Util } from "./util";
export abstract class Scraper {
    page: Page;
    browser: Browser
    url: string;
    protected initialize: any;
    constructor(browser: Browser, url: string){
        this.browser = browser;
        this.url = url;
        this.initialize = async () => await this.init()
    }

    protected async init() {
        this.page = await this.browser.newPage();
        await this.page.goto(this.url, {waitUntil: "domcontentloaded"});
        await this.page.setViewport({ width: 1080, height: 1024 });
    }

    protected async elementExists(selector: string): Promise<boolean> {
        let element = (await this.page.$(selector)) || "";
        return element !== ""
    }

    public abstract scrape(params?: any);
    
}


