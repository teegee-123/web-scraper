import express from "express";
import { BrowserManager } from "./run-scraper";
import { BotManager } from "./run-telegram-bot";

const app = express();
const browserManager = new BrowserManager()
const botManager = new BotManager(browserManager)

const PORT = process.env.PORT || 4000;
console.log(process.env.IS_LIVE)
app.get("/scrape", async (req, res) => {
  // res.send(await runScraper())
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);  
  await browserManager.launchBrowser()  
  await botManager.startListeners()
});
