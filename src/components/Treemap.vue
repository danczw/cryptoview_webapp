<template>
  <div id="body">
    <div id="treemap"></div>
    <div id="tooltip"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { useStore } from "vuex";

// TODO: remove when API is implemented
import datajson from "../assets/data.json";
import metadatajson from "../assets/metadata.json"; 

export default {
  name: "Treemap",
  setup() {
    const store = useStore();
    return { store }
  },

  mounted() {
    this.treemap();
  },

  methods: {
    treemap() {      
      // create number formatter
      // TODO: add second formatter for decimal
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      });

      async function viz(_store) {
        try {
          let apiResult = await apiRequest(_store);
          _store.commit("setMetaData", metadatajson);
          console.log(apiResult)

          let transfResult = await transfData(_store);
          console.log(transfResult);

          let generateResult = await generateTree(_store);
          console.log(generateResult);

        } catch (error) {
          console.log(error);
        }
      }
      viz(this.store);
      
      function apiRequest(_store) {
        // TODO: refactor to vuex
        // TODO: build REST API
        return new Promise((resolve) => {
          const cmc_key = process.env.VUE_APP_COIN;
          const rp = require("request-promise");
          const requestOptions = {
            method: "GET",
            uri: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
            qs: {
              "start": "1",
              "limit": "50",
              "convert": "USD"
            },
            headers: {
              "X-CMC_PRO_API_KEY": cmc_key,
            },
            json: true,
            gzip: true
          };
          rp(requestOptions).then(response => {
            _store.commit("setQuoteData", response);
            resolve("data fetched from coinmarketcap");
          }).catch((err) => {
            _store.commit("setQuoteData", datajson);
            _store.commit("setMetaData", metadatajson);
            console.log(err.message);
          });
        })
      }
      
      function transfData(_store) {
        _store.commit("resetTransfData")
        return new Promise((resolve) => {
          for (let crypto = 0; crypto < _store.state.quoteData.data.length; crypto++) {
            let newData = {
              "id": _store.state.quoteData.data[crypto].id,
              "name": _store.state.quoteData.data[crypto].name,
              "symbol": _store.state.quoteData.data[crypto].symbol,
              "price": _store.state.quoteData.data[crypto].quote.USD.price,
              "slug": _store.state.quoteData.data[crypto].slug,
              "market_cap": _store.state.quoteData.data[crypto].quote.USD.market_cap
            }
            _store.commit("addTransfData", newData)
          }
          let otherData = {
            "id": 0,
            "name": "Other",
            "symbol": "Other",
            "price": NaN,
            "slug": "other",
            "market_cap": _store.state.metaData.data.quote.USD.total_market_cap
          }
          _store.commit("addTransfData", otherData)
          resolve("data transformed")
        })
      }

      function generateTree(_store) {
        return new Promise((resolve) => {
          const w = window.innerWidth;
          const h = window.innerHeight - 50;

          const hierarchy = d3.hierarchy(_store.state.transfData)
            .sum(d => d.market_cap)
            .sort((a, b) => b.market_cap - a.market_cap);

          const treemap = d3.treemap()
            .size([w, h])
            .padding(1)

          const root = treemap(hierarchy);

          const svg = d3.select("#treemap")
            .append("svg")
            .attr("viewBox", [0, 0, w, h])

          svg.selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr("x", d=>d.x0)   
            .attr("y", d=>d.y0)
            .attr("width",  d=>d.x1 - d.x0)
            .attr("height", d=>d.y1 - d.y0)
            .attr("fill", "#2a9d8f")
            .on("mouseover", function(d) {
              d3.select(this)
                .transition()
                .duration(200)
                .attr("opacity", 0.8);
              d3.select("#tooltip")
                .transition()
                .duration(200)
                .style("opacity", 1)
              d3.select("#tooltip")
                .html(`
                  <table>
                    <tr>
                      <th>
                        ${d.originalTarget.__data__.data.name}</br>
                      </th>
                    </tr>
                    <tr>
                      <td>
                        Quote:
                      </td>
                      <td>
                        ${formatter.format(d.originalTarget.__data__.data.price)}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Market Cap:
                      </td>
                      <td>
                          ${formatter.format(d.originalTarget.__data__.data.market_cap)}
                      </td>
                    </tr>
                  </table>`
                )
            }).on("mouseout", function() {
                d3.select(this)
                  .transition()
                  .duration(200)
                  .attr("opacity", 1);
                d3.select("#tooltip")
                  .style("opacity", 0)
            }).on("mousemove", function() {
              d3.select("#tooltip")
                .style("left", (event.x + 10) + "px")
                .style("top", (event.y + 10) + "px")
            })

          // console.log(root.leaves()[0].data.symbol)

          svg.selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .selectAll("tspan")
            .data(d => {
              console.log(d.data.symbol)
              return d.data.symbol.split(/(?=[A-Z][^A-Z])/g) // split the symbol
                .map(v => {
                  return {
                    text: v,
                    x0: d.x0,                        // keep x0 reference
                    y0: d.y0                         // keep y0 reference
                  }
                });
            })
            .enter()
            .append("tspan")
            .attr("x", (d) => d.x0 + 5)
            .attr("y", (d, i) => d.y0 + 15 + (i * 10))       // offset by index 
            .text((d) => d.text)
            .attr("font-size", "0.8em")
            .attr("fill", "white");
          resolve("tree map build")
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#tooltip {
  position: absolute;
  text-align: left;
  padding: .5rem;
  background: #FFFFFF;
  color: #313639;
  border: 1px solid #3b4e79;
  border-radius: 2px;
  pointer-events: none;
  font-size: 0.9rem;
}
</style>
