import { MoonShotData } from "./models";
import { Scraper } from "./scraper";
import { Util } from "./util";

export class MoonShotApiScraper {

    async scrape(params: any): Promise<MoonShotData[]> {
        const trades = await Util.fetchJsonValue(`https://api.moonshot.cc/trades/v2/latest/solana?minVolumeUsd=5&limit=30`)
        const mappedTrades = trades.map(trade => {                
            return {
                address: trade.baseToken.address,
                pairId: trade.pairId,
                name: trade.baseToken.name,
                curveProgress: trade.metadata.progress,
                volume: parseFloat(trade.volumeUsd.trim())
            }
        });
       
        const coinData: MoonShotData[] = mappedTrades.map(async t => {
            const coinInfo = await Util.fetchJsonValue(`https://api.dexscreener.com/latest/dex/pairs/solana/${t.pairId}`)
            const mapped = {
                marketCap: coinInfo.pairs[0].fdv,
                age: Math.ceil((new Date().getTime() - coinInfo.pairs[0].pairCreatedAt)/1000),
                readTime: new Date(),
                ...t
            }
            const data = new MoonShotData()
            data.address = mapped.address
            data.pairId = mapped.pairId
            data.name = mapped.name
            data.age = mapped.age
            data.marketCap = mapped.marketCap
            data.volume = mapped.volume
            data.curveProgress = mapped.curveProgress
            data.readTime = mapped.readTime
            
            return await data
        })
        return await coinData
    }

}
