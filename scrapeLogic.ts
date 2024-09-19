import { Page } from 'puppeteer';
import puppeteer from 'puppeteer';
require("dotenv").config();
const NODE_ENV = process.env.NODE_ENV ?? 'dev'
const PUPPETEER_EXECUTABLE_PATH = process.env.PUPPETEER_EXECUTABLE_PATH ?? puppeteer.executablePath()



export const scrapeLogic = async (res) => {
  console.log(NODE_ENV)
  const browser = await puppeteer.launch({
    headless: true, // NODE_ENV === "production",
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: PUPPETEER_EXECUTABLE_PATH 
  });
  

  try {
    const page: Page = await browser.newPage();
    await page.goto("https://developer.chrome.com/");

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });
    await page.waitForSelector('.devsite-landing-row-description')
    let element = await page.$('.devsite-landing-row-description')
    let value = await page.evaluate(el => el.textContent, element)
    res.send(value)
//    res.send("DONE")
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
