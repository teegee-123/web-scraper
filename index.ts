import express from "express";
import { runScraper } from "./runScraper";
import TelegramBot from "node-telegram-bot-api";
import { PumpFunData } from "./scrapers/pump-fun.scraper";

const app = express();

const PORT = process.env.PORT || 4000;
const MAX_AGE = parseInt(process.env.MAX_AGE)
const MAX_MARKET_CAP = parseInt(process.env.MAX_MARKET_CAP)
const MIN_REPLIES = parseInt(process.env.MIN_REPLIES)
const IS_LIVE = process.env.IS_LIVE === 'true'
console.log(process.env.IS_LIVE)
app.get("/scrape", async (req, res) => {
  res.send(await runScraper())
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);  

  const bot = new TelegramBot(process.env.BOT_TOKEN)
  if(bot.isPolling()) {        
    await bot.removeAllListeners('message')
    await bot.stopPolling({cancel: true, reason: 'starting a new listener'})
  }
  await bot.startPolling({restart: true})

  bot.on('message', async (msg, meta) => {
    
    console.log(msg)
    console.log(IS_LIVE)
    if(msg.text?.toLowerCase()==="list"){
      const data = await runScraper()
      
      if(typeof(data) === 'string') {
        await bot.sendMessage(msg.chat.id, `ERROR ${data}`, {reply_to_message_id: msg.message_id})
      } else {
        const sendData  = (data as PumpFunData[]).filter(x => {
          return x.age <= MAX_AGE && 
                x.marketCap <= MAX_MARKET_CAP && 
                x.replies > MIN_REPLIES &&
                x.isLive === IS_LIVE
        });
        sendData.forEach(async m => {          
          await bot.sendMessage(msg.chat.id, JSON.stringify(m, null, 4), {reply_to_message_id: msg.message_id})
        })
        if(!sendData.length) {
          await bot.sendMessage(msg.chat.id, "No data found for parameters", {reply_to_message_id: msg.message_id})
        }
    }
    

    }
  })
});
