const ticker = document.getElementById("data");

let countDown = document.getElementById("countDown");

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



setInterval(function () {
  seconds++;
  countDown.innerHTML = `Last update = ${seconds} seconds ago`;
}, 1000);

socket.onmessage = function (event) {
  data = JSON.parse(event.data);

  if (data[0]["ev"] == "status") {
    console.log(data);
  } else {

    seconds = 0;

    let price = Number(data[0]["a"]);

    priceHistory.push(price);

    //if price is higher than the last element in the array, then add a class of green to the p tag
    
    if (price > priceHistory[priceHistory.length - 2]) {
      ticker.classList.add("green");
      ticker.classList.remove("red");
    } else {
      ticker.classList.add("red");
      ticker.classList.remove("green");
    }

    // calculate the difference between the last two elements in the array

    let difference = price - priceHistory[priceHistory.length - 2].toFixed(2);

    // if the difference is positive, then add a + sign to the difference, if negative then add a - sign

    if (difference > 0) {
      difference = "+" + difference;
    } else {
      difference = "-" + difference;
    }



    

    let ttPrice = ((price + 4) * 1.417).toFixed(3);

    let ttCustomer = (((price + 24) / 31.10347) * 116.64 * 0.377).toFixed(3);


    ticker.innerHTML = `<p>$${price} (${difference})</p> <p>TT Jeweller = <b>BD${ttPrice}</b></p> <p>TT Customer = <b>BD${ttCustomer}</b></p>`;

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
