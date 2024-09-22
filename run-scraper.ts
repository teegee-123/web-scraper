import puppeteer, { Browser } from 'puppeteer';
import { Scraper } from './scrapers/scraper';
require("dotenv").config();
const NODE_ENV = process.env.NODE_ENV ?? 'dev'
const PUPPETEER_EXECUTABLE_PATH = process.env.PUPPETEER_EXECUTABLE_PATH ?? puppeteer.executablePath()

export class BrowserManager {
    browser: Browser;
    constructor(){
      this.browser?.on('disconnected', () => {
        try { 
          this.browser.close()
        } catch(e) {
          console.log(" disconnected "+ e)
        }
      });
    }

    async isBrowserRunning(): Promise<boolean> {
      return !!this.browser && (await this.browser?.pages())?.length !== 0 && this.browser.isConnected()      
    }

    async launchBrowser(){
      if(await this.isBrowserRunning()) 
        return
      else{
        this.browser = await puppeteer.launch({
          headless: NODE_ENV === "production",
          args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
          ],
          executablePath: PUPPETEER_EXECUTABLE_PATH 
        }); 
      }
    }

    async tryScrape(scraper: Scraper, params: any = null){
      try{
        if(!(await this.isBrowserRunning())) 
          await this.launchBrowser();        
          return await scraper.scrape(params);
        } catch(e) {
          return `ERROR ${e}`
        } finally {

        }
    }
}


// const bot = new TelegramBot(process.env.BOT_TOKEN)
// export const runScraper = async (): Promise<PumpFunData[] | string> => {
//   console.log(NODE_ENV)
 

//   try {
//     const scraper = new PumpFunScraper(browser, "https://pump.fun/board")    
//     const data = await scraper.scrape()    
//     return data
//   } catch (e) {
//     console.error(e);
//     return `ERROR ${e}`
//   } finally {
//     await browser.close();
//   }
// };

// module.exports = { runScraper: runScraper };
