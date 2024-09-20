import { Page } from 'puppeteer';
import puppeteer from 'puppeteer';
import { Scraper } from './scrapers/scraper';
import { PumpFunScraper } from './scrapers/pump-fun.scraper';
require("dotenv").config();
const NODE_ENV = process.env.NODE_ENV ?? 'dev'
const PUPPETEER_EXECUTABLE_PATH = process.env.PUPPETEER_EXECUTABLE_PATH ?? puppeteer.executablePath()

export const runScraper = async (): Promise<string> => {
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

  } catch (e) {
    console.error(e);
    return `ERROR ${e}`
  } finally {
    await browser.close();
  }
};

module.exports = { runScraper: runScraper };
