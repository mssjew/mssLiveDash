const askPriceP = document.getElementById("askPrice");
let todaysDateP = document.getElementById("todaysDate");
let currentTimeP = document.getElementById("currentTime");
let marketStatus = document.getElementById("marketStatus");

// Price elements for all currencies
const weights = ['oneGram', 'twoHalfGram', 'fiveGram', 'tenGram', 'twentyGram', 'oneOunce', 'fiftyGram', 'hundredGram', 'ttPrice'];
const currencies = ['bhd', 'usd', 'sar', 'aed'];

// Create object to store previous prices for comparison
let previousPrices = {};
weights.forEach(weight => {
    previousPrices[weight] = {
        bhd: 0,
        usd: 0,
        sar: 0,
        aed: 0
    };
});

// Create object to store all price elements
let priceElements = {};
weights.forEach(weight => {
    priceElements[weight] = {};
    currencies.forEach(currency => {
        priceElements[weight][currency] = document.getElementById(`${weight}_${currency}`);
    });
});

const API_KEY_STATIC = "mQK2zB2lxayaitBVpJEC";
const API_KEY_STREAMING = "wsMuoUboU-NHSHFX0LwA";

// Format number with commas and decimals if needed
function formatNumber(num, decimals = 0) {
    const numStr = Number(num).toFixed(decimals);
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updatePriceColor(element, newPrice, oldPrice) {
    if (oldPrice === 0) {
        element.className = 'price-neutral';
    } else if (newPrice > oldPrice) {
        element.className = 'price-up';
    } else if (newPrice < oldPrice) {
        element.className = 'price-down';
    }
}

function calculatePrices(price) {
    // Calculate base BHD prices
    const bhd_prices = {
        oneGram: (((price + 700) / 31.10347) * 1 * 0.377).toFixed(3),
        twoHalfGram: (((price + 325) / 31.10347) * 2.5 * 0.377).toFixed(3),
        fiveGram: (((price + 275) / 31.10347) * 5 * 0.377).toFixed(3),
        tenGram: (((price + 180) / 31.10347) * 10 * 0.377).toFixed(3),
        twentyGram: (((price + 125) / 31.10347) * 20 * 0.377).toFixed(3),
        oneOunce: (((price + 82) / 31.10347) * 31.10347 * 0.377).toFixed(3),
        fiftyGram: (((price + 77) / 31.10347) * 50 * 0.377).toFixed(3),
        hundredGram: (((price + 41) / 31.10347) * 100 * 0.377).toFixed(3),
        ttPrice: (((price + 13) / 31.10347) * 116.64 * 0.377).toFixed(3)
    };

    // Update all prices and colors
    weights.forEach(weight => {
        // BHD (3 decimals)
        const bhd_price = Number(bhd_prices[weight]);
        priceElements[weight].bhd.innerText = formatNumber(bhd_price, 3);
        updatePriceColor(priceElements[weight].bhd, bhd_price, previousPrices[weight].bhd);
        previousPrices[weight].bhd = bhd_price;

        // USD (2 decimals)
        const usd_price = Number((bhd_price / 0.377).toFixed(2));
        priceElements[weight].usd.innerText = formatNumber(usd_price, 2);
        updatePriceColor(priceElements[weight].usd, usd_price, previousPrices[weight].usd);
        previousPrices[weight].usd = usd_price;

        // SAR (3 decimals)
        const sar_price = Number((bhd_price * 10).toFixed(3));
        priceElements[weight].sar.innerText = formatNumber(sar_price, 3);
        updatePriceColor(priceElements[weight].sar, sar_price, previousPrices[weight].sar);
        previousPrices[weight].sar = sar_price;

        // AED (3 decimals) - Updated conversion rate
        const aed_price = Number((bhd_price / 0.1028).toFixed(3));
        priceElements[weight].aed.innerText = formatNumber(aed_price, 3);
        updatePriceColor(priceElements[weight].aed, aed_price, previousPrices[weight].aed);
        previousPrices[weight].aed = aed_price;
    });
}

let socket;

const connectWS = () => {
    let askPriceHistory = [];
    socket = new WebSocket("wss://marketdata.tradermade.com/feedadv");

    socket.onopen = function (e) {
        socket.send(`{"userKey":"${API_KEY_STREAMING}", "symbol":"XAUUSD"}`);
    };

    socket.onmessage = function incoming(data) {
        let askPrice = data.data.split(",")[3];
        let askPriceFormatted = askPrice.substring(6, askPrice.length);
        // Show 2 decimals for live gold price
        askPriceP.innerText = formatNumber(Number(askPriceFormatted), 2);
        askPriceHistory.push(Number(askPriceFormatted));

        if (askPriceHistory.length > 1) {
            if (askPriceHistory[askPriceHistory.length - 1] > askPriceHistory[askPriceHistory.length - 2]) {
                askPriceP.className = 'price-up';
            } else if (askPriceHistory[askPriceHistory.length - 1] < askPriceHistory[askPriceHistory.length - 2]) {
                askPriceP.className = 'price-down';
            }
        }

        if (askPriceHistory.length > 3) {
            askPriceHistory.shift();
        }

        if (askPriceFormatted) {
            calculatePrices(Number(askPriceFormatted));
        }
    };

    socket.onerror = function (error) {
        console.error(`WebSocket Error: ${error.message}`);
        setTimeout(connectWS, 5000);
    };

    socket.onclose = function() {
        console.log('WebSocket Connection Closed. Reconnecting...');
        setTimeout(connectWS, 5000);
    };
};

// Handle weekend market closure
let currentDay = new Date().getDay();
if (currentDay === 0 || currentDay === 6) {
    marketStatus.innerHTML = "(MARKET CLOSED)";
    async function getClosedPrice() {
        try {
            let resp = await axios.get(
                `https://marketdata.tradermade.com/api/v1/live?currency=XAUUSD&api_key=${API_KEY_STATIC}`
            );
            let price = resp.data.quotes[0].ask;
            askPriceP.innerText = formatNumber(Number(price), 2);
            calculatePrices(price);
        } catch (error) {
            console.error("Error fetching closed market price:", error);
            setTimeout(getClosedPrice, 5000);
        }
    }
    getClosedPrice();
} else {
    connectWS();
    setInterval(() => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            connectWS();
        }
    }, 120000);
}

// Update date and time
function updateDateTime() {
    const now = new Date();
    const dateOptions = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    todaysDateP.innerText = now.toLocaleDateString('en-US', dateOptions);
    currentTimeP.innerText = now.toLocaleTimeString('en-US', timeOptions);
}

updateDateTime();
setInterval(updateDateTime, 1000);