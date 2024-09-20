import puppeteer from 'puppeteer';
import { PumpFunData, PumpFunScraper } from './scrapers/pump-fun.scraper';
import TelegramBot from 'node-telegram-bot-api';
require("dotenv").config();
const NODE_ENV = process.env.NODE_ENV ?? 'dev'
const PUPPETEER_EXECUTABLE_PATH = process.env.PUPPETEER_EXECUTABLE_PATH ?? puppeteer.executablePath()
// const bot = new TelegramBot(process.env.BOT_TOKEN)
export const runScraper = async (): Promise<PumpFunData[] | string> => {
  console.log(NODE_ENV)
  const browser = await puppeteer.launch({
    headless: NODE_ENV === "production",
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: PUPPETEER_EXECUTABLE_PATH 
  });
  

  try {
    const scraper = new PumpFunScraper(browser, "https://pump.fun/board")    
    const data = await scraper.scrape()    
    return data
  } catch (e) {
    console.error(e);
    return `ERROR ${e}`
  } finally {
    await browser.close();
  }
};

module.exports = { runScraper: runScraper };
