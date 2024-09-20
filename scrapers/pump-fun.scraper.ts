import { Browser, Page } from "puppeteer";
import { Scraper } from "./scraper";
import { Util } from "./util";

export class PumpFunScraper extends Scraper {
    READY_TO_PUMP_BUTTON_SELECTOR = 'button.inline-flex.items-center.justify-center.whitespace-nowrap.rounded-md.text-sm.font-medium.ring-offset-white.transition-colors'
    PAGE_READY_SELECTOR = 'a:nth-child(10)'
    getAddress = (href) => {
        return href.slice(-1)[0]
    }

    public override async scrape() {
     
        await this.init();   
        if(await this.elementExists(this.READY_TO_PUMP_BUTTON_SELECTOR)){
            await this.page.click(this.READY_TO_PUMP_BUTTON_SELECTOR)
        }        

        await this.page.waitForSelector(this.PAGE_READY_SELECTOR)
        const data = await this.page.$$eval('a[href^="/"]',  links => links.filter(x =>  x.classList.length===0).map(x => {return {html: x.innerHTML, text: x.innerText, href: x.href}}));
        const d =  data.filter(x => !!x.text && (x.href.length === 61 ||x.href.length === 62)).map(x => {
            return{
                originalText: x.text,
                address: x.href.split("/").slice(-1)[0],
                name: x.text.split("\n").slice(-1)[0],
                marketCap: this.readMarketCap(x.text),
                age: this.readAge(x.text),
                replies: this.readReplies(x.text),
                isLive: x.text.startsWith('Currently live streaming!')
            }
        })
        return d
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