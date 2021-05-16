const express = require('express')
const app = express()
const port = 3000

app.get('/', (request, response) => {
  console.log("query successful")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// const cmc_key = process.env.VUE_APP_COIN;
// const rp = require("request-promise");
// const requestOptions = {
// method: "GET",
// uri: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
// qs: {
//     "start": "1",
//     "limit": "3",
//     "convert": "USD"
// },
// headers: {
//     "X-CMC_PRO_API_KEY": cmc_key,
// },
// json: true,
// gzip: true
// };