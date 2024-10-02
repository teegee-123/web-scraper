export abstract class ScraperData {
    readTime: Date;
    abstract to_message()
}

export class PumpFunData implements ScraperData {
    readTime: Date;
    originalText: string; 
    address: string; 
    name: string; 
    marketCap: number; 
    age: number; 
    replies: number; 
    isLive: boolean; 

    to_message() {
        return `
            *address*: \`${this.address}\`
            *name*: ${this.name}
            *age*: ${this.age}
            *marketCap*: ${this.marketCap}
            *replies*: ${this.replies}
            *isLive*: ${this.isLive}
            *readTime*: ${this.readTime}
            *originalText*: ${this.originalText}`
    }   
}


export class MoonShotData implements ScraperData {
    address: string;
    pairId: string;
    name: string;
    age: number;
    marketCap: number;
    volume: number;
    curveProgress: number;
    readTime: Date;
   


    to_message() {
        return `

                *address*: \`${this.address}\`
                *pairId*: \`${this.pairId}\`
                *name*: ${this.name}
                *age*: ${this.age}
                *marketCap*: ${this.marketCap}
                *volume*: ${this.volume}
                *curveProgress*: ${this.curveProgress}
                *readTime*: ${this.readTime}`

    }   
}