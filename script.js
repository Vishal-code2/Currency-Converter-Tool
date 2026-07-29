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

// Currency List
const currencies = [
    "USD","EUR","GBP","INR","JPY","AUD","CAD","CHF","CNY","SGD",
    "NZD","AED","SAR","PKR","BDT","LKR","THB","KRW","HKD","MYR",
    "ZAR","RUB","BRL","MXN"
];

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

        result.textContent =
            `${amount} ${fromCurrency.value} = ${convertedAmount} ${toCurrency.value}`;

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

    convertCurrency();

}

// Event Listeners
convertBtn.addEventListener("click", convertCurrency);

swapBtn.addEventListener("click", swapCurrencies);

// Convert when currency changes
fromCurrency.addEventListener("change", convertCurrency);
toCurrency.addEventListener("change", convertCurrency);

// Load Data
loadCurrencies();
convertCurrency();