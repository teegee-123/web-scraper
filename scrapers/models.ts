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