import TelegramBot from "node-telegram-bot-api"
import { PumpFunData } from "./scrapers/models"
import { BrowserManager } from "./run-scraper"
import { PumpFunScraper } from "./scrapers/pump-fun.scraper"
require("dotenv").config();

export class BotManager {
    bot: TelegramBot
    browserManager: BrowserManager
    numberOfTrades: number = 0
    constructor(browserManager: BrowserManager) {
        this.bot = new TelegramBot(process.env.BOT_TOKEN)
        this.browserManager = browserManager
    }

    get maxAmountOfTradesToSend(): number {
        return 8 - this.numberOfTrades;
    }
    
    async startListeners(){
        if(this.bot.isPolling()) {        
            await this.bot.removeAllListeners('message')
            await this.bot.stopPolling({cancel: true, reason: 'starting a new listener'})
          }
          await this.bot.startPolling({restart: true})

            
        this.bot.on('message', async (msg, meta) => {
            if(msg.text?.toLowerCase() === '/status') {
                await this.bot.sendMessage(msg.chat.id, `*Status: * 
                    ${(await this.browserManager.isBrowserRunning())}`, {reply_to_message_id: msg.message_id, parse_mode: 'Markdown'})
            }
            if(msg.text?.toLowerCase() === '/launch') {
                await this.browserManager.launchBrowser();
                await this.bot.sendMessage(msg.chat.id, `*Done: *`, {reply_to_message_id: msg.message_id, parse_mode: 'Markdown' })
            }
            if(msg.text?.toLowerCase().startsWith('/pump')) {
                // message is formatted as MAX_AGE MAX_MARKET_CAP MIN_REPLIES IS_LIVE
                const args = msg.text.split(" ")
                const params = {
                    MAX_AGE: this.readArgNumber(args[1], 600),
                    MAX_MARKET_CAP: this.readArgNumber(args[2], 5000),
                    MIN_REPLIES: this.readArgNumber(args[3], 0),
                    IS_LIVE: !!args[4],
                }
                console.log(params)
                let data = await this.browserManager.tryScrape(
                    new PumpFunScraper(this.browserManager.browser, 'https://pump.fun/board'),
                    params
                ) as PumpFunData[] | string
                if(typeof(data) === 'string') {
                    await this.bot.sendMessage(msg.chat.id, `*Error: *${data}`, {reply_to_message_id: msg.message_id, parse_mode: 'Markdown' })    
                }
                else {
                    let skipped = []
                    try {
                        if(this.maxAmountOfTradesToSend >= 0){
                            skipped = data.splice(this.maxAmountOfTradesToSend)
                        }
                        data.forEach(async pumpItem => {
                            await this.bot.sendMessage(msg.chat.id, pumpItem.to_message(), {reply_to_message_id: msg.message_id, parse_mode: 'Markdown' })
                        })
                        await this.bot.sendMessage(msg.chat.id, `Done skipped *${skipped.length} items*`, {reply_to_message_id: msg.message_id, parse_mode: 'Markdown' })
                    } catch(e) {
                        console.log("ERROR: ", e)
                        await this.bot.sendMessage(msg.chat.id, `Error *${e}*`, {reply_to_message_id: msg.message_id, parse_mode: 'Markdown' })
                    }
                    
                }
            }
            if(msg.text?.toLowerCase().startsWith('/set')) {
                const args = msg.text.split(" ")
                const numberOfTrades = this.readArgNumber(args[1], 0)
                console.log(`SET Currently there are ${numberOfTrades} trades`)
                this.numberOfTrades = numberOfTrades
                const responseMessage = await this.bot.sendMessage(msg.chat.id, `Currently there are *${numberOfTrades}* trades, scraper will send at most *${this.maxAmountOfTradesToSend}*`, {reply_to_message_id: msg.message_id, parse_mode: 'Markdown' })
                await this.bot.deleteMessage(msg.chat.id, responseMessage.message_id)
                await this.bot.deleteMessage(msg.chat.id, msg.message_id)
            }            
            if(msg.text?.toLowerCase().startsWith('/get')) {
                console.log(`GET Currently there are ${this.numberOfTrades} trades`)                
                await this.bot.sendMessage(msg.chat.id, `Currently there are *${this.numberOfTrades}* trades, scraper will send at most *${this.maxAmountOfTradesToSend}*`, {reply_to_message_id: msg.message_id, parse_mode: 'Markdown' })
            }  
            if(msg.text?.includes(process.env.WALLET_ADDRESS)) {
                try{
                    const balanceString = msg.text.split("Main |")[1].split("\n")[0].replace("SOL", "").trim()                    
                    const balance = parseFloat(balanceString)
                    await this.bot.sendMessage(msg.chat.id, JSON.stringify({numTrades: this.numberOfTrades, balance: balance}))
                    await this.bot.deleteMessage(msg.chat.id, msg.message_id)
                } catch(e) {
                    console.log('e', e)
                }
            }            

      })
    }

    private readArgNumber(arg: string | undefined | null, defaultValue: number){
        if(!arg || (arg && isNaN(parseInt(arg)))) {
            return defaultValue
        }
        return parseInt(arg)
    }
}
