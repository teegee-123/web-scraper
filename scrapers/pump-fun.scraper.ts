import { PumpFunData } from "./models";
import { Scraper } from "./scraper";
import { Util } from "./util";
require('dotenv').config()
const token = process.env.BOT_TOKEN
export class PumpFunScraper extends Scraper {
    READY_TO_PUMP_BUTTON_SELECTOR = 'button.inline-flex.items-center.justify-center.whitespace-nowrap.rounded-md.text-sm.font-medium.ring-offset-white.transition-colors'
    PAGE_READY_SELECTOR = 'a:nth-child(10)'
    getAddress = (href) => {
        return href.slice(-1)[0]
    }

    public override async scrape(params: any = null): Promise<PumpFunData[]> {
        await this.init();   
        if(await this.elementExists(this.READY_TO_PUMP_BUTTON_SELECTOR)){
            await this.page.click(this.READY_TO_PUMP_BUTTON_SELECTOR)
        }        

        await this.page.waitForSelector(this.PAGE_READY_SELECTOR)
        const data = await this.page.$$eval('a[href^="/"]', 
            links => links.filter(x =>  x.classList.length===0).map(x => {return {html: x.innerHTML, text: x.innerText, href: x.href}}));
        const scrapedData: PumpFunData[] =  data
            .filter(x => !!x.text && (x.href.length === 61 ||x.href.length === 62))
            .map(x => {
                const data = new PumpFunData();
                data.originalText = x.text;
                data.address = x.href.split("/").slice(-1)[0];
                data.name = x.text.split("\n").slice(-1)[0];
                data.marketCap = this.readMarketCap(x.text);
                data.age = this.readAge(x.text);
                data.replies = this.readReplies(x.text);
                data.isLive = x.text.startsWith('Currently live streaming!');
                data.readTime = new Date();
                return data;
            })
            .filter(x => {
                return x.age <= params.MAX_AGE && 
                    x.marketCap <= params.MAX_MARKET_CAP && 
                    x.replies > params.MIN_REPLIES &&
                    x.isLive === params.IS_LIVE
            })

        return scrapedData
    }

    readMarketCap(text: string) {
        const mc = text.split("\n").find(x => x.includes("market cap: "))
        const value = mc.split("market cap: ")[1] ?? '0k'
        return Util.getCurrencyValue(value)
    }

    readAge(text: string) {        
        text = text.split("\n").find(x => x.endsWith(" ago")).replace("ago", "")
        return Util.getTimeValueInSeconds(text);
    }

    readReplies(text){
        const replies = text.split("\n").find(x => x.includes("replies: "));        
        return parseInt(replies.replace("replies: ", "") ?? '0');
    }
}