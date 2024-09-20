export class Util {
    static async delay(time) {
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        });
     }
    // convert 27k to 27000
    static getCurrencyValue(val: string) {
        val = val.toUpperCase().trim()
        let convertedValue = 0;
        if(val.endsWith('K')) convertedValue = parseFloat(val.replace('K', '')) * 1000
        else if(val.endsWith('M')) convertedValue = parseFloat(val.replace('M', '')) * 1000000
        else convertedValue = parseFloat(val)        
        return convertedValue;
    }

    // converts 5m to 300
    static getTimeValueInSeconds(val: string) {
        val = val.toUpperCase().trim()
        let convertedValue = 0;
        if(val.endsWith('MONTHS')) convertedValue = parseFloat(val.replace('D', '')) * 31 * 24 * 60 * 60
        else if(val.endsWith('D')) convertedValue = parseFloat(val.replace('D', '')) * 24 * 60 * 60
        else if(val.endsWith('H')) convertedValue = parseFloat(val.replace('H', '')) * 60 * 60
        else if(val.endsWith('M')) convertedValue = parseFloat(val.replace('M', '')) * 60
        else if(val.endsWith('S')) convertedValue = parseFloat(val.replace('S', ''))
        else convertedValue = parseFloat(val)        
        return convertedValue;
    }
}