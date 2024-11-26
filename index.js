const ticker = document.getElementById("data");
let countDown = document.getElementById("countDown");
let priceList = document.getElementById("priceList");
let askPriceP = document.getElementById("askPrice");
let todaysDateP = document.getElementById("todaysDate");
let currentTimeP = document.getElementById("currentTime");
let marketStatus = document.getElementById("marketStatus");

// BHD price elements
let oneGramTicker = document.getElementById("oneGramTicker");
let twoHalfGramTicker = document.getElementById("twoHalfGramTicker");
let fiveGramTicker = document.getElementById("fiveGramTicker");
let tenGramTicker = document.getElementById("tenGramTicker");
let twentyGramTicker = document.getElementById("twentyGramTicker");
let oneOunceTicker = document.getElementById("oneOunceTicker");
let fiftyGramTicker = document.getElementById("fiftyGramTicker");
let hundredGramTicker = document.getElementById("hundredGramTicker");
let ttPriceTicker = document.getElementById("ttPriceTicker");

// USD price elements
let oneGramTickerUSD = document.getElementById("oneGramTickerUSD");
let twoHalfGramTickerUSD = document.getElementById("twoHalfGramTickerUSD");
let fiveGramTickerUSD = document.getElementById("fiveGramTickerUSD");
let tenGramTickerUSD = document.getElementById("tenGramTickerUSD");
let twentyGramTickerUSD = document.getElementById("twentyGramTickerUSD");
let oneOunceTickerUSD = document.getElementById("oneOunceTickerUSD");
let fiftyGramTickerUSD = document.getElementById("fiftyGramTickerUSD");
let hundredGramTickerUSD = document.getElementById("hundredGramTickerUSD");
let ttPriceTickerUSD = document.getElementById("ttPriceTickerUSD");

// SAR price elements
let oneGramTickerSAR = document.getElementById("oneGramTickerSAR");
let twoHalfGramTickerSAR = document.getElementById("twoHalfGramTickerSAR");
let fiveGramTickerSAR = document.getElementById("fiveGramTickerSAR");
let tenGramTickerSAR = document.getElementById("tenGramTickerSAR");
let twentyGramTickerSAR = document.getElementById("twentyGramTickerSAR");
let oneOunceTickerSAR = document.getElementById("oneOunceTickerSAR");
let fiftyGramTickerSAR = document.getElementById("fiftyGramTickerSAR");
let hundredGramTickerSAR = document.getElementById("hundredGramTickerSAR");
let ttPriceTickerSAR = document.getElementById("ttPriceTickerSAR");

// Store previous prices for comparison
let previousPrices = {};

const API_KEY_STATIC = "mQK2zB2lxayaitBVpJEC";
const API_KEY_STREAMING = "wsMuoUboU-NHSHFX0LwA";

function updatePriceColor(element, newPrice, previousPrice) {
    if (previousPrice !== undefined) {
        if (newPrice > previousPrice) {
            element.parentElement.classList.remove('price-down');
            element.parentElement.classList.add('price-up');
        } else if (newPrice < previousPrice) {
            element.parentElement.classList.remove('price-up');
            element.parentElement.classList.add('price-down');
        }
    }
}

function updatePrices(bhdPrice, element, elementUSD, elementSAR, identifier) {
    const previousBHD = previousPrices[identifier]?.bhd;
    const previousUSD = previousPrices[identifier]?.usd;
    const previousSAR = previousPrices[identifier]?.sar;

    const bhdFormatted = Number(bhdPrice.toFixed(0));
    const usdFormatted = Number((bhdPrice * 2.65).toFixed(0));
    const sarFormatted = Number((bhdPrice * 10).toFixed(0));

    element.innerText = bhdFormatted;
    elementUSD.innerText = usdFormatted;
    elementSAR.innerText = sarFormatted;

    updatePriceColor(element, bhdFormatted, previousBHD);
    updatePriceColor(elementUSD, usdFormatted, previousUSD);
    updatePriceColor(elementSAR, sarFormatted, previousSAR);

    previousPrices[identifier] = {
        bhd: bhdFormatted,
        usd: usdFormatted,
        sar: sarFormatted
    };
}

async function goldClosed() {
    let resp = await axios.get(
        `https://marketdata.tradermade.com/api/v1/live?currency=XAUUSD&api_key=${API_KEY_STATIC}`
    );
    return resp.data.quotes[0];
}

let currentDay = new Date().getDay();

if (currentDay === 0 || currentDay === 6) {
    marketStatus.innerHTML = " (MARKET CLOSED) ";

    goldClosed().then((data) => {
        let askPrice = data.ask;
        askPriceP.innerText = askPrice;

        let price = askPrice;

        const calculations = [
            { price: ((price + 700) / 31.10347) * 1 * 0.377, elements: [oneGramTicker, oneGramTickerUSD, oneGramTickerSAR], id: '1g' },
            { price: ((price + 325) / 31.10347) * 2.5 * 0.377, elements: [twoHalfGramTicker, twoHalfGramTickerUSD, twoHalfGramTickerSAR], id: '2.5g' },
            { price: ((price + 275) / 31.10347) * 5 * 0.377, elements: [fiveGramTicker, fiveGramTickerUSD, fiveGramTickerSAR], id: '5g' },
            { price: ((price + 180) / 31.10347) * 10 * 0.377, elements: [tenGramTicker, tenGramTickerUSD, tenGramTickerSAR], id: '10g' },
            { price: ((price + 125) / 31.10347) * 20 * 0.377, elements: [twentyGramTicker, twentyGramTickerUSD, twentyGramTickerSAR], id: '20g' },
            { price: ((price + 82) / 31.10347) * 31.10347 * 0.377, elements: [oneOunceTicker, oneOunceTickerUSD, oneOunceTickerSAR], id: '1oz' },
            { price: ((price + 77) / 31.10347) * 50 * 0.377, elements: [fiftyGramTicker, fiftyGramTickerUSD, fiftyGramTickerSAR], id: '50g' },
            { price: ((price + 41) / 31.10347) * 100 * 0.377, elements: [hundredGramTicker, hundredGramTickerUSD, hundredGramTickerSAR], id: '100g' },
            { price: ((price + 13) / 31.10347) * 116.64 * 0.377, elements: [ttPriceTicker, ttPriceTickerUSD, ttPriceTickerSAR], id: 'tt' }
        ];

        calculations.forEach(calc => {
            updatePrices(calc.price, ...calc.elements, calc.id);
        });
    });
} else {
    const connectWS = () => {
        let askPriceHistory = [];
        let socket = new WebSocket("wss://marketdata.tradermade.com/feedadv");

        socket.onopen = function (e) {
            socket.send(`{"userKey":"${API_KEY_STREAMING}", "symbol":"XAUUSD"}`);
        };

        socket.onmessage = function incoming(data) {
            let askPrice = data.data.split(",")[3];
            askPriceFormatted = askPrice.substring(6, askPrice.length);
            askPriceP.innerText = askPriceFormatted;
            askPriceHistory.push(Number(askPriceFormatted));

            if (askPriceHistory.length > 1) {
                if (askPriceHistory[askPriceHistory.length - 1] > askPriceHistory[askPriceHistory.length - 2]) {
                    askPriceP.style.color = "#00aa00";
                } else if (askPriceHistory[askPriceHistory.length - 1] < askPriceHistory[askPriceHistory.length - 2]) {
                    askPriceP.style.color = "#cc0000";
                }
            }

            if (askPriceHistory.length > 3) {
                askPriceHistory.shift();
            }

            if (askPriceFormatted) {
                let price = Number(askPriceFormatted);

                const calculations = [
                    { price: ((price + 700) / 31.10347) * 1 * 0.377, elements: [oneGramTicker, oneGramTickerUSD, oneGramTickerSAR], id: '1g' },
                    { price: ((price + 325) / 31.10347) * 2.5 * 0.377, elements: [twoHalfGramTicker, twoHalfGramTickerUSD, twoHalfGramTickerSAR], id: '2.5g' },
                    { price: ((price + 275) / 31.10347) * 5 * 0.377, elements: [fiveGramTicker, fiveGramTickerUSD, fiveGramTickerSAR], id: '5g' },
                    { price: ((price + 180) / 31.10347) * 10 * 0.377, elements: [tenGramTicker, tenGramTickerUSD, tenGramTickerSAR], id: '10g' },
                    { price: ((price + 125) / 31.10347) * 20 * 0.377, elements: [twentyGramTicker, twentyGramTickerUSD, twentyGramTickerSAR], id: '20g' },
                    { price: ((price + 82) / 31.10347) * 31.10347 * 0.377, elements: [oneOunceTicker, oneOunceTickerUSD, oneOunceTickerSAR], id: '1oz' },
                    { price: ((price + 77) / 31.10347) * 50 * 0.377, elements: [fiftyGramTicker, fiftyGramTickerUSD, fiftyGramTickerSAR], id: '50g' },
                    { price: ((price + 41) / 31.10347) * 100 * 0.377, elements: [hundredGramTicker, hundredGramTickerUSD, hundredGramTickerSAR], id: '100g' },
                    { price: ((price + 13) / 31.10347) * 116.64 * 0.377, elements: [ttPriceTicker, ttPriceTickerUSD, ttPriceTickerSAR], id: 'tt' }
                ];

                calculations.forEach(calc => {
                    updatePrices(calc.price, ...calc.elements, calc.id);
                });
            }
        };

        socket.onerror = function (error) {
            alert(`[error] ${error.message}`);
        };
    };

    connectWS();
    setInterval(connectWS, 120000);
}

let todaysDate = new Date();
let todaysDateFormatted = todaysDate.toDateString();
todaysDateP.innerText = todaysDateFormatted;

setInterval(function () {
    let currentTime = new Date();
    let currentTimeFormatted = currentTime.toLocaleTimeString();
    currentTimeP.innerText = currentTimeFormatted;
}, 1000);