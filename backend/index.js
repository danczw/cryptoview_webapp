require("dotenv").config();
const rp = require("request-promise");
const express = require('express');
const app = express();
const port = 3000;

app.get('/quotes/', (request, response) => {
    console.log(request.query)
    response.set("Access-Control-Allow-Origin", "*")
    const cmc_key = process.env.CMC_KEY;
    const requestOptions = {
        method: "GET",
        uri: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
        qs: {
            "start": "1",
            "limit": "3",
            "convert": "USD"
        },
        headers: {
            "X-CMC_PRO_API_KEY": cmc_key,
        },
        json: true,
        gzip: true
    };
    rp(requestOptions).then(res => {
        response.send(res.data);
    }).catch((err) => {
        console.log(err.message);
    });
})

app.get('/meta/', (request, response) => {
    console.log(request.query)
    response.set("Access-Control-Allow-Origin", "*")
    const cmc_key = process.env.CMC_KEY;
    const requestOptions = {
        method: "GET",
        uri: "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest",
        qs: {
            "convert": "USD"
        },
        headers: {
            "X-CMC_PRO_API_KEY": cmc_key,
        },
        json: true,
        gzip: true
    };
    rp(requestOptions).then(res => {
        response.send(res.data);
    }).catch((err) => {
        console.log(err.message);
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})