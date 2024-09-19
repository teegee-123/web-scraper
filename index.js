const express = require('express');
const scraper = require('./run-scraper')

const app  = express()
const PORT = process.env.PORT || 4000



app.listen(PORT, () => {
    console.log("listening on port "+ PORT)
})

app.get("/", (req, res)=> {
    res.send("UP")
})

app.get("/scrape", (req, res)=> {
    scraper.runScraper(res)
})