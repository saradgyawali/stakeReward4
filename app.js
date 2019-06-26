const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const port = process.env.PORT || 80;
let averageFeeInDollar;
let rewardToken;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname) + "/public"));
// Add headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
  //__dirname : It will resolve to your project folder.
});
app.post("/calculate", (req, res) => {
  const { daily, averageFee } = req.body;
  averageFeeInDollar = (averageFee * daily) / 100;
  res.json(averageFeeInDollar);
});

app.post("/calculateToken", (req, res) => {
  const { stake, loyaltyToken } = req.body;
  rewardToken = (loyaltyToken * averageFeeInDollar * 0.01) / stake;
  res.json(rewardToken);
});

app.post("/calculateTotalEarning", (req, res) => {
  const { holdingToken } = req.body;
  const earnPerDay = holdingToken * rewardToken;
  const earnPerWeek = holdingToken * rewardToken * 7;
  const earnPerMonth = holdingToken * rewardToken * 30;
  res.json({ earnPerDay, earnPerWeek, earnPerMonth });
});
app.listen(port, console.log("Done"));
