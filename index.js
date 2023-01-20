const ticker = document.getElementById("data");

let countDown = document.getElementById("countDown");

let priceList = document.getElementById("priceList");

let bidPriceP = document.getElementById("bidPrice");
let askPriceP = document.getElementById("askPrice");

let lowestDay = document.getElementById("lowestDay");
let highestDay = document.getElementById("highestDay");

let todaysDateP = document.getElementById("todaysDate");
let currentTimeP = document.getElementById("currentTime");

let marketStatus = document.getElementById("marketStatus");

let oneGramTicker = document.getElementById("oneGramTicker");
let twoHalfGramTicker = document.getElementById("twoHalfGramTicker");
let fiveGramTicker = document.getElementById("fiveGramTicker");
let tenGramTicker = document.getElementById("tenGramTicker");
let oneTolaTicker = document.getElementById("oneTolaTicker");
let twentyGramTicker = document.getElementById("twentyGramTicker");
let twoTolaTicker = document.getElementById("twoTolaTicker");
let oneOunceTicker = document.getElementById("oneOunceTicker");
let fiftyGramTicker = document.getElementById("fiftyGramTicker");
let fiveTolaTicker = document.getElementById("fiveTolaTicker");
let hundredGramTicker = document.getElementById("hundredGramTicker");
let ttPriceTicker = document.getElementById("ttPriceTicker");

async function goldToday() {
    let resp = await axios.get(
      `https://marketdata.tradermade.com/api/v1/historical?currency=XAUUSD&date=${currDate}&api_key=CzyOm57xTxByAcyzwJ-1`
    );
    return resp.data.quotes[0];
  }

  async function goldClosed() {
    let resp = await axios.get(
      `https://marketdata.tradermade.com/api/v1/live?currency=XAUUSD&api_key=CzyOm57xTxByAcyzwJ-1`
    );
    return resp.data.quotes[0];
  }

// check the current day and log it
let currentDay = new Date().getDay();
console.log(currentDay);


// if current day is saturday or sunday, display the message
if (currentDay === 0 || currentDay === 6) {
    marketStatus.innerHTML = " (MARKET CLOSED) ";

    goldClosed().then((data) => {
        let bidPrice = data.bid;
        bidPriceP.innerText = bidPrice;
        let askPrice = data.ask;
        askPriceP.innerText = askPrice;

        let price = askPrice;

        oneGramTicker.innerText = (((price + 700) / 31.10347) * 1 * 0.377).toFixed(
          3
        );
        twoHalfGramTicker.innerText = (
          ((price + 325) / 31.10347) *
          2.5 *
          0.377
        ).toFixed(3);
        fiveGramTicker.innerText = (((price + 270) / 31.10347) * 5 * 0.377).toFixed(
          3
        );
        tenGramTicker.innerText = (((price + 160) / 31.10347) * 10 * 0.377).toFixed(
          3
        );
        oneTolaTicker.innerText = (
          ((price + 145) / 31.10347) *
          11.664 *
          0.377
        ).toFixed(3);
        twentyGramTicker.innerText = (
          ((price + 100) / 31.10347) *
          20 *
          0.377
        ).toFixed(3);
        twoTolaTicker.innerText = (
          ((price + 105) / 31.10347) *
          23.328 *
          0.377
        ).toFixed(3);
        oneOunceTicker.innerText = (
          ((price + 60) / 31.10347) *
          31.10347 *
          0.377
        ).toFixed(3);
        fiftyGramTicker.innerText = (
          ((price + 68) / 31.10347) *
          50 *
          0.377
        ).toFixed(3);
        fiveTolaTicker.innerText = (
          ((price + 70) / 31.10347) *
          58.32 *
          0.377
        ).toFixed(3);
        hundredGramTicker.innerText = (
          ((price + 48) / 31.10347) *
          100 *
          0.377
        ).toFixed(3);
        ttPriceTicker.innerText = (
          ((price + 11) / 31.10347) *
          116.64 *
          0.377
        ).toFixed(3);
    })

} else {

    let priceHistory = [];

let bidPriceHistory = [];
let askPriceHistory = [];


    let socket = new WebSocket("wss://marketdata.tradermade.com/feedadv");

socket.onopen = function (e) {
  socket.send('{"userKey":"wsyq7Qki66DBHGD5fxJg", "symbol":"XAUUSD"}');
};

socket.onmessage = function incoming(data) {
    let bidPrice = data.data.split(",")[2];
    bidPriceFormatted = bidPrice.substring(6, bidPrice.length);
    bidPriceP.innerText = bidPriceFormatted;
    bidPriceHistory.push(Number(bidPriceFormatted));
  
    //if current ask price is greater than last ask price in array make it green
    //if current ask price is less than last ask price in array make it red
    //if current ask price is equal to last ask price in array make it gray
  
    if (askPriceHistory.length > 1) {
      if (
        askPriceHistory[askPriceHistory.length - 1] >
        askPriceHistory[askPriceHistory.length - 2]
      ) {
        askPriceP.style.color = "green";
      } else if (
        askPriceHistory[askPriceHistory.length - 1] <
        askPriceHistory[askPriceHistory.length - 2]
      ) {
        askPriceP.style.color = "red";
      }
    }
  
    let askPrice = data.data.split(",")[3];
    askPriceFormatted = askPrice.substring(6, askPrice.length);
    askPriceP.innerText = askPriceFormatted;
    askPriceHistory.push(Number(askPriceFormatted));
  
    if (bidPriceHistory.length > 3) {
      bidPriceHistory.shift();
    }
    if (askPriceHistory.length > 3) {
      askPriceHistory.shift();
    }
  
    //if current bid price is greater than last bid price in array make it green
    //if current bid price is less than last bid price in array make it red
    //if current bid price is equal to last bid price in array make it gray
  
    if (bidPriceHistory.length > 1) {
      if (
        bidPriceHistory[bidPriceHistory.length - 1] >
        bidPriceHistory[bidPriceHistory.length - 2]
      ) {
        bidPriceP.style.color = "green";
      } else if (
        bidPriceHistory[bidPriceHistory.length - 1] <
        bidPriceHistory[bidPriceHistory.length - 2]
      ) {
        bidPriceP.style.color = "red";
      }
    }
  
    if (bidPriceFormatted) {
      let price = Number(bidPriceFormatted);
  
      oneGramTicker.innerText = (((price + 700) / 31.10347) * 1 * 0.377).toFixed(
        3
      );
      twoHalfGramTicker.innerText = (
        ((price + 325) / 31.10347) *
        2.5 *
        0.377
      ).toFixed(3);
      fiveGramTicker.innerText = (((price + 270) / 31.10347) * 5 * 0.377).toFixed(
        3
      );
      tenGramTicker.innerText = (((price + 160) / 31.10347) * 10 * 0.377).toFixed(
        3
      );
      oneTolaTicker.innerText = (
        ((price + 145) / 31.10347) *
        11.664 *
        0.377
      ).toFixed(3);
      twentyGramTicker.innerText = (
        ((price + 100) / 31.10347) *
        20 *
        0.377
      ).toFixed(3);
      twoTolaTicker.innerText = (
        ((price + 105) / 31.10347) *
        23.328 *
        0.377
      ).toFixed(3);
      oneOunceTicker.innerText = (
        ((price + 60) / 31.10347) *
        31.10347 *
        0.377
      ).toFixed(3);
      fiftyGramTicker.innerText = (
        ((price + 68) / 31.10347) *
        50 *
        0.377
      ).toFixed(3);
      fiveTolaTicker.innerText = (
        ((price + 70) / 31.10347) *
        58.32 *
        0.377
      ).toFixed(3);
      hundredGramTicker.innerText = (
        ((price + 48) / 31.10347) *
        100 *
        0.377
      ).toFixed(3);
      ttPriceTicker.innerText = (
        ((price + 11) / 31.10347) *
        116.64 *
        0.377
      ).toFixed(3);
    }
  
    
  
    if (priceHistory.length > 1) {
      if (
        priceHistory[priceHistory.length - 1] >
        priceHistory[priceHistory.length - 2]
      ) {
        ticker.style.color = "green";
      } else if (
        priceHistory[priceHistory.length - 1] <
        priceHistory[priceHistory.length - 2]
      ) {
        ticker.style.color = "red";
      } else {
        ticker.style.color = "gray";
      }
    }
  };

  socket.onerror = function (error) {
    alert(`[error] ${error.message}`);
  };

}



// get todays date and insert into html
let todaysDate = new Date();
let todaysDateFormatted = todaysDate.toDateString();
todaysDateP.innerText = todaysDateFormatted;



// keep updating the current time
setInterval(function () {
    let currentTime = new Date();
    let currentTimeFormatted = currentTime.toLocaleTimeString();
    currentTimeP.innerText = currentTimeFormatted;
    }, 1000);


// "https://marketdata.tradermade.com/api/v1/historical?currency=XAUUSD&date=2023-01-22&api_key=CzyOm57xTxByAcyzwJ-1"

// start a stopwatch and insert the seconds into the html

// create function to reset the stopwatch





// if(priceObject)  console.log(priceObject.substring(6, priceObject.length - 1) + "  Tick#" + counter);

// let ttPrice = (((askPrice + 11)/31.10347)*116.64*0.377).toFixed(3);

// let hundredGrams = (((askPrice + 48)/31.10347)*100*0.377).toFixed(3);

// let fiveTola = (((askPrice + 70)/31.10347)*58.32*0.377).toFixed(3);

// let fiftyGrams = (((askPrice + 68)/31.10347)*50*0.377).toFixed(3);

// let oneOunce = (((askPrice + 60)/31.10347)*31.10347*0.377).toFixed(3);

// let twoTola = (((askPrice + 105)/31.10347)*23.328*0.377).toFixed(3);

// let twentyGrams = (((askPrice + 100)/31.10347)*20*0.377).toFixed(3);

// let oneTola = (((askPrice + 145)/31.10347)*11.664*0.377).toFixed(3);

// let tenGrams = (((askPrice + 160)/31.10347)*10*0.377).toFixed(3);

// let fiveGrams = (((askPrice + 270)/31.10347)*5*0.377).toFixed(3);

// let twoandHalfGrams = (((askPrice + 325)/31.10347)*2.5*0.377).toFixed(3);

// let oneGram = (((askPrice + 700)/31.10347)*1*0.377).toFixed(3);

// console.log(priceHistory);

// console.log(data[0]["a"]);
// data.map((msg) => {
//   if (data.ev === "status") {
//     return console.log("Status Update:", msg.message);
//   }

//   ticker.innerHTML = data[0];
//   console.log(data[0]);
// });



let currDate = new Date().toISOString().slice(0, 10);


goldToday().then((data) => {
  console.log(data.high);
  console.log(data.low);

lowestDay.innerText = (data.low).toFixed(2);
highestDay.innerText = (data.high).toFixed(2);


});

const historicalURL = `https://marketdata.tradermade.com/api/v1/historical?currency=XAUUSD&date=${currDate}&api_key=CzyOm57xTxByAcyzwJ-1`;
