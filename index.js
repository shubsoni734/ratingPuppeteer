const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const { finalRanking } = require('./finalRanking');
const { axiosScrape } = require('./axiosScrape');
const app = express();

const PORT = process.env.PORT || 4000;

// app.get("/scrape", (req, res) => {
//   scrapeLogic(req,res);
// });

app.get('/ratings/:id', scrapeLogic);
app.get('/fied/:url', axiosScrape);
app.get('/finalRanking/tournament/:tournamentid/round/:round', finalRanking);

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
