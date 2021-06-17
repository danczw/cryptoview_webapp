require("dotenv").config();
const rp = require("request-promise");
const path = require("path");
const express = require('express');
const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, "cryptoview_app/dist")))

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'cryptoview_app/dist/index.html'));
  });

app.get('/quotes/', (request, response) => {
    console.log(request.query)
    response.set("Access-Control-Allow-Origin", "*")
    const cmc_key = process.env.CMC_KEY;
    const requestOptions = {
        method: "GET",
        uri: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
        qs: {
            "start": "1",
            "limit": "15",
            "convert": "USD"
        },
        headers: {
            "X-CMC_PRO_API_KEY": cmc_key,
        },
        json: true,
        gzip: true
    };
    rp(requestOptions).then(res => {
        // console.log(res);
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