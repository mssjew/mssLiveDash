const ticker = document.getElementById("data");

let countDown = document.getElementById("countDown");

let priceList = document.getElementById("priceList");

// start a stopwatch and insert the seconds into the html

// create function to reset the stopwatch

const APIKEY = "MSrxp0wCzzxnwMtWQaCS9OA3ph2jlA9w";

let socket = new WebSocket("wss://socket.polygon.io/forex");

socket.onopen = function (e) {
  socket.send(`{"action":"auth","params":"${APIKEY}"}`);
  socket.send(`{"action":"subscribe","params":"C.XAU/USD"}`);
};


var seconds = 0;

let priceHistory = [];



// g1.innerHTML =
// "BD " +
// Math.round((((priceDecimal + 700) / 31.10347) * 0.377).toFixed(3));
// g25.innerHTML =
// "BD " + Math.round(((priceDecimal + 325) / 31.10347) * 2.5 * 0.377);
// g5.innerHTML =
// "BD " +
// Math.round((((priceDecimal + 270) / 31.10347) * 5 * 0.377).toFixed(3));
// g10.innerHTML =
// "BD " +
// Math.round((((priceDecimal + 160) / 31.10347) * 10 * 0.377).toFixed(3));

// var g1t = document.getElementById("1tp");
// var g20 = document.getElementById("20gp");
// var g2t = document.getElementById("2tp");
// var g31 = document.getElementById("31gp");

// g1t.innerHTML =
// "BD " +
// Math.round(
//   (((priceDecimal + 145) / 31.10347) * 11.664 * 0.377).toFixed(3)
// );
// g20.innerHTML =
// "BD " +
// Math.round((((priceDecimal + 100) / 31.10347) * 20 * 0.377).toFixed(3));
// g2t.innerHTML =
// "BD " +
// Math.round(
//   (((priceDecimal + 105) / 31.10347) * 23.328 * 0.377).toFixed(3)
// );
// g31.innerHTML =
// "BD " +
// Math.round(
//   (((priceDecimal + 60) / 31.10347) * 31.10347 * 0.377).toFixed(3)
// );

// var g50 = document.getElementById("50gp");
// var g5t = document.getElementById("5tp");
// var g100 = document.getElementById("100gp");
// var gtt = document.getElementById("10tp");

// g50.innerHTML =
// "BD " +
// Math.round((((priceDecimal + 68) / 31.10347) * 50 * 0.377).toFixed(3));
// g5t.innerHTML =
// "BD " +
// Math.round((((priceDecimal + 70) / 31.10347) * 58.32 * 0.377).toFixed(3));
// g100.innerHTML =
// "BD " +
// Math.round((((priceDecimal + 48) / 31.10347) * 100 * 0.377).toFixed(3));
// gtt.innerHTML =
// "BD " +
// Math.round(
//   (((priceDecimal + 11) / 31.10347) * 116.64 * 0.377).toFixed(3)
// );
// })
// .catch((err) => {
// x.innerHTML = "Error, refresh.";
// console.log("Error failed to get price:", err);
// });

setInterval(function () {
  seconds++;
  countDown.innerHTML = `Last updated = ${seconds} seconds ago`;
}, 1000);

socket.onmessage = function (event) {
  data = JSON.parse(event.data);

  if (data[0]["ev"] == "status") {
    console.log(data);
    let askPrice = 10;
  } else {
    console.log(data[0]);

    seconds = 0;


    let bidPrice = Number(data[0]["b"]);

    priceHistory.push(askPrice);

    //if price is higher than the last element in the array, then add a class of green to the p tag
    
    if (askPrice > priceHistory[priceHistory.length - 2]) {
      ticker.classList.add("green");
      ticker.classList.remove("red");
    } else {
      ticker.classList.add("red");
      ticker.classList.remove("green");
    }

    // calculate the difference between the last two elements in the array

    let difference = askPrice - priceHistory[priceHistory.length - 2];

    // if the difference is positive, then add a + sign to the difference, if negative then add a - sign

    if (difference > 0) {
      difference = "+" + difference;
    } 


    

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


    ticker.innerHTML = `<p>Ask: $${askPrice} (${difference})</p> <p>Bid: $${bidPrice} </p>`;

    console.log(priceHistory);

  }
  // console.log(data[0]["a"]);
  // data.map((msg) => {
  //   if (data.ev === "status") {
  //     return console.log("Status Update:", msg.message);
  //   }

  //   ticker.innerHTML = data[0];
  //   console.log(data[0]);
  // });
};




socket.onerror = function (error) {
  alert(`[error] ${error.message}`);
};
