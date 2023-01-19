const ticker = document.getElementById("data");

let countDown = document.getElementById("countDown");

let priceList = document.getElementById("priceList");

// start a stopwatch and insert the seconds into the html

// create function to reset the stopwatch


let socket = new WebSocket("wss://marketdata.tradermade.com/feedadv");

socket.onopen = function (e) {
  socket.send('{"userKey":"wsyq7Qki66DBHGD5fxJg", "symbol":"XAUUSD"}');
};



let priceHistory = [];


socket.onmessage = function incoming(data) {

  let priceObject = data.data.split(",")[4];

  if(priceObject) {
    let price = Number(priceObject.substring(6, priceObject.length - 1));
    let askPrice = price;
    ticker.innerHTML = `<p>Live Tick: $${price}</p>`;

    let ttPrice = (((askPrice + 11)/31.10347)*116.64*0.377).toFixed(3);

    let hundredGrams = (((askPrice + 48)/31.10347)*100*0.377).toFixed(3);

    let fiveTola = (((askPrice + 70)/31.10347)*58.32*0.377).toFixed(3);

    let fiftyGrams = (((askPrice + 68)/31.10347)*50*0.377).toFixed(3);

    let oneOunce = (((askPrice + 60)/31.10347)*31.10347*0.377).toFixed(3);

    let twoTola = (((askPrice + 105)/31.10347)*23.328*0.377).toFixed(3);

    let twentyGrams = (((askPrice + 100)/31.10347)*20*0.377).toFixed(3);

    let oneTola = (((askPrice + 145)/31.10347)*11.664*0.377).toFixed(3);

    let tenGrams = (((askPrice + 160)/31.10347)*10*0.377).toFixed(3);

    let fiveGrams = (((askPrice + 270)/31.10347)*5*0.377).toFixed(3);

    let twoandHalfGrams = (((askPrice + 325)/31.10347)*2.5*0.377).toFixed(3);

    let oneGram = (((askPrice + 700)/31.10347)*1*0.377).toFixed(3);

     priceList.innerHTML = '<li>1g = BD ' + oneGram + '</li> <li>2.5g = BD ' + twoandHalfGrams + '</li> <li>5g = BD ' + fiveGrams + '</li> <li>10g = BD ' + tenGrams + '</li> <li>1T = BD ' + oneTola + '</li> <li>20g = BD ' + twentyGrams + '</li> <li>2T = BD ' + twoTola + '</li> <li>1Oz = BD ' + oneOunce + '</li> <li>50g = BD ' + fiftyGrams + '</li> <li>5T = BD ' + fiveTola + '</li> <li>100g = BD ' + hundredGrams + '</li> <li>10T = BD ' + ttPrice + '</li>';

    priceHistory.push(price);
    if(priceHistory.length > 3) {
      priceHistory.shift();
    }
    


  }

  //if price is greater than last price in array make it green
  //if price is less than last price in array make it red
  //if price is equal to last price in array make it gray

  if(priceHistory.length > 1) {
    if(priceHistory[priceHistory.length - 1] > priceHistory[priceHistory.length - 2]) {
      ticker.style.color = "green";
    } else if(priceHistory[priceHistory.length - 1] < priceHistory[priceHistory.length - 2]) {
      ticker.style.color = "red";
    } else {
      ticker.style.color = "gray";
    }
  }

      






 

 
 

};
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





socket.onerror = function (error) {
  alert(`[error] ${error.message}`);
};
