require("dotenv").config();
const rp = require("request-promise");
const express = require('express');
const app = express();
const port = 8080;

app.use(express.static(process.cwd() + "/cryptoview_app/dist"))

app.get('/', (request, response) => {
    response.sendFile(process.cwd() + '/cryptoview_app/dist/index.html');
  });

app.get('/quotes/', (request, response) => {
    // console.log(request.query);
    response.set("Access-Control-Allow-Origin", "*");
    const cmc_key = process.env.CMC_KEY;

    var metaData;
    var rawQuoteData;
    var transfQuoteData = [];
    var returnData = {meta: [], quotes: []};

    // get market meta data
    const metaRequestOptions = {
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
    rp(metaRequestOptions).then(metaRes => {
        metaData = metaRes.data;
        
        // then get quote data
        const quoteRequestOptions = {
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
    
        rp(quoteRequestOptions).then(quoteRes => {
            rawQuoteData = quoteRes.data;

            var time = new Date();
            console.log(`query received: ${time}`);

            // then transform quote data
            var displayedMarketCap = 0;

            for (let crypto = 0; crypto < rawQuoteData.length; crypto++) {
                displayedMarketCap += rawQuoteData[crypto].quote.USD.market_cap

                var newCrypto = {
                    "id": rawQuoteData[crypto].id,
                    "name": rawQuoteData[crypto].name,
                    "symbol": rawQuoteData[crypto].symbol,
                    "price": rawQuoteData[crypto].quote.USD.price,
                    "slug": rawQuoteData[crypto].slug,
                    "market_cap": rawQuoteData[crypto].quote.USD.market_cap,
                    "market_cap_perc": rawQuoteData[crypto].quote.USD.market_cap / metaData.quote.USD.total_market_cap * 100,
                    "volume_24h": rawQuoteData[crypto].quote.USD.volume_24h,
                    "percent_change_1h": rawQuoteData[crypto].quote.USD.percent_change_1h,
                    "percent_change_24h": rawQuoteData[crypto].quote.USD.percent_change_24h,
                    "percent_change_7d": rawQuoteData[crypto].quote.USD.percent_change_7d
                };
                transfQuoteData.push(newCrypto);

            }

            var otherCrypto = {
                "id": 0,
                "name": "Other",
                "symbol": "Other",
                "price": NaN,
                "slug": "other",
                "market_cap": metaData.quote.USD.total_market_cap - displayedMarketCap,
                "market_cap_perc": (metaData.quote.USD.total_market_cap - displayedMarketCap) / metaData.quote.USD.total_market_cap * 100,
                
                // TODO: check API documentation
                "volume_24h": NaN,
                "percent_change_1h": NaN,
                "percent_change_24h": NaN,
                "percent_change_7d": NaN
            }
            transfQuoteData.push(otherCrypto);

            // then combine in return array and respond
            returnData.meta.push(metaData);
            returnData.quotes.push(transfQuoteData);
            response.send(returnData);
        }).catch((err) => {
            console.log(err.message);
        });

    }).catch((err) => {
        console.log(err.message);
    });
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})