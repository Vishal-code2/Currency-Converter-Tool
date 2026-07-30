// API URL
const API_URL = "https://open.er-api.com/v6/latest/";

// HTML Elements
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");

const result = document.getElementById("result");
const exchangeRate = document.getElementById("exchangeRate");
const lastUpdated = document.getElementById("lastUpdated");
const errorMessage = document.getElementById("errorMessage");


// History Elements
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

// Flag Images
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");
const countryList = {
    USD: "US",
    EUR: "EU",
    GBP: "GB",
    INR: "IN",
    JPY: "JP",
    AUD: "AU",
    CAD: "CA",
    CHF: "CH",
    CNY: "CN",
    SGD: "SG",
    NZD: "NZ",
    AED: "AE",
    SAR: "SA",
    PKR: "PK",
    BDT: "BD",
    LKR: "LK",
    THB: "TH",
    KRW: "KR",
    HKD: "HK",
    MYR: "MY",
    ZAR: "ZA",
    RUB: "RU",
    BRL: "BR",
    MXN: "MX"
};
// Currency List
const currencies = [
    "USD","EUR","GBP","INR","JPY","AUD","CAD","CHF","CNY","SGD",
    "NZD","AED","SAR","PKR","BDT","LKR","THB","KRW","HKD","MYR",
    "ZAR","RUB","BRL","MXN"
];

let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];

// Fill Dropdowns
function loadCurrencies() {

    currencies.forEach(currency => {

        const option1 = document.createElement("option");
        option1.value = currency;
        option1.textContent = currency;
        fromCurrency.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = currency;
        option2.textContent = currency;
        toCurrency.appendChild(option2);

    });

    fromCurrency.value = "USD";
    toCurrency.value = "INR";
}

function updateFlags() {

    fromFlag.src =
        `https://flagsapi.com/${countryList[fromCurrency.value]}/flat/64.png`;

    toFlag.src =
        `https://flagsapi.com/${countryList[toCurrency.value]}/flat/64.png`;

}

function displayHistory() {

    historyList.innerHTML = "";

    history.forEach(item => {

        const li = document.createElement("li");
        li.textContent = item;

        historyList.appendChild(li);

    });

}

// Convert Currency
async function convertCurrency() {

    const amount = Number(amountInput.value);

    if (amount <= 0 || isNaN(amount)) {
        errorMessage.textContent = "Please enter a valid amount.";
        result.textContent = "--";
        return;
    }

    errorMessage.textContent = "";

    try {

        const response = await fetch(API_URL + fromCurrency.value);
        const data = await response.json();

        if (data.result !== "success") {
            throw new Error("API Error");
        }

        const rate = data.rates[toCurrency.value];
const convertedAmount = (amount * rate).toFixed(2);

// Display Result
result.textContent =
`${amount} ${fromCurrency.value} = ${convertedAmount} ${toCurrency.value}`;

// Save History
const historyItem =
`${amount} ${fromCurrency.value} → ${toCurrency.value} = ${convertedAmount}`;

history.unshift(historyItem);

// Keep only latest 10 conversions
if (history.length > 10) {
    history.pop();
}

// Save to Local Storage
localStorage.setItem(
    "conversionHistory",
    JSON.stringify(history)
);

// Refresh History List
displayHistory();

// Exchange Rate
exchangeRate.textContent =
`1 ${fromCurrency.value} = ${rate} ${toCurrency.value}`;

        const now = new Date();

        lastUpdated.textContent =
            `Last Updated: ${now.toLocaleString()}`;

    }
    catch (error) {

        errorMessage.textContent =
            "Unable to fetch exchange rates. Please try again.";

    }

}

// Swap Currencies
function swapCurrencies() {

    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    updateFlags();      // swap flag too
    convertCurrency();

}

// Event Listeners
convertBtn.addEventListener("click", convertCurrency);

swapBtn.addEventListener("click", swapCurrencies);

// history
clearHistoryBtn.addEventListener("click", () => {

    history = [];

    localStorage.removeItem("conversionHistory");

    displayHistory();

});

// Convert when currency changes
// fromCurrency.addEventListener("change", convertCurrency);
// toCurrency.addEventListener("change", convertCurrency);

// flag update
fromCurrency.addEventListener("change", () => {
    updateFlags();
    convertCurrency();
});

toCurrency.addEventListener("change", () => {
    updateFlags();
    convertCurrency();
});


function displayHistory() {

    historyList.innerHTML = "";

    history.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item;

        historyList.appendChild(li);

    });

}



// Load Data
loadCurrencies();
updateFlags();      // swap flag too
displayHistory();   //hsitory
convertCurrency();