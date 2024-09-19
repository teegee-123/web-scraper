const puppeteer = require('puppeteer')
require('dotenv').config()

const runScraper = async (res) =>  {    
    console.log(process.env.NODE_ENV)
    console.log(process.env.PUPPETEER_EXECUTABLE_PATH)
    console.log(puppeteer.executablePath())
    const browser = await puppeteer.launch({
        // headless: false,
        args:[
            // '--no-sandbox',
            '--disable-setui-sandbox',
            '--single-process',
            '--no-zygote'
        ],
        executablePath: process.env.NODE_ENV==="production" ? 
                        process.env.PUPPETEER_EXECUTABLE_PATH : 
                        puppeteer.executablePath(),
    });
    try{

        const page = await browser.newPage();
    
        await page.goto('https://developer.chrome.com/');
    
        await page.setViewport({width: 1080, height: 1024});    
        // await page.locator('.devsite-search-field').fill('automate beyond recorder');
        // await page.locator('.devsite-result-item-link').click();
        // const textSelector = await page
        // .locator('text/Customize and automate')
        // .waitHandle();
    
        // const fullTitle = await textSelector?.evaluate(el => el.textContent);
    
        await page.locator('.devsite-landing-row-description')
        await page.waitForSelector('.devsite-landing-row-description')
        let element = await page.$('.devsite-landing-row-description')
        let value = await page.evaluate(el => el.textContent, element)
        console.log('The title of this blog post is "%s".', value);
        res.send(value)
    } catch(e) {
        console.error(e)
        res.send(`Pupeteer crashed ${e}`)
    } finally{

        await browser.close();
    }
}

module.exports={
    runScraper: (res) => runScraper(res)
}