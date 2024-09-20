import express from "express";
import { runScraper } from "./runScraper";




const app = express();

const PORT = process.env.PORT || 4000;

app.get("/scrape", async (req, res) => {
  res.send(await runScraper())
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  await runScraper()
});
