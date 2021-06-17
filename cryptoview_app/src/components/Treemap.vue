<template>
  <div id="body">
    <div class="lds-wrapper">
      <div class="lds-hourglass" v-if="loading"></div>
    </div>
    <div class="svg-wrapper">
      <div id="treemap"></div>
    </div>
    <div id="tooltip"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { useStore } from "vuex";
import axios from "axios"

// TODO: remove when API is implemented
import datajson from "../assets/data.json";
import metadatajson from "../assets/metadata.json"; 

export default {
  name: "Treemap",
  setup() {
    const store = useStore();
    return { store }
  },
  data: () => ({
    loading: false
  }),
  mounted() {
    this.treemap();
  },

  methods: {
    treemap() {
      this.loading = true;
      let vm = this;
      // create number formatter
      // TODO: add second formatter for decimal
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      });

      const formatter_dec = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2
      });

      async function viz(_store) {
        try {
          let quotesResult = await quotesApi(_store);
          console.log("Why is this " + quotesResult) // TODO: ??
          let metaResult = await metaApi(_store);
          console.log("Why is this " + metaResult) // TODO: ??
          
          let transfResult = await transfData(_store);
          console.log(transfResult);

          let generateResult = await generateTree(_store);
          console.log(generateResult);

        } catch (error) {
          console.log(error);
        }
        vm.loading = false;
      }
      viz(this.store);
      
      async function quotesApi(_store) {
        const apiUrl = "https://cryptoview.azurewebsites.net/quotes/";
        try {
          let response = await axios(`${ apiUrl }`);
          _store.commit("setQuoteData", response);
        } catch (error) {
          _store.commit("setQuoteData", datajson);
          console.log(error);
        }
      }

      async function metaApi(_store) {
        const apiUrl = "https://cryptoview.azurewebsites.net/meta/";
        try {
          let response = await axios(`${ apiUrl }`);
          _store.commit("setMetaData", response);
        } catch (error) {
          _store.commit("setMetaData", metadatajson);
          console.log(error);
        }
      }
      
      function transfData(_store) {
        _store.commit("resetTransfData")
        return new Promise((resolve) => {
          _store.commit("resetMarketCapShown");
          // TODO: write getters
          for (let crypto = 0; crypto < _store.state.quoteData.data.length; crypto++) {
            _store.commit("addMarketCapShown", _store.state.quoteData.data[crypto].quote.USD.market_cap);
            let newData = {
              "id": _store.state.quoteData.data[crypto].id,
              "name": _store.state.quoteData.data[crypto].name,
              "symbol": _store.state.quoteData.data[crypto].symbol,
              "price": _store.state.quoteData.data[crypto].quote.USD.price,
              "slug": _store.state.quoteData.data[crypto].slug,
              "market_cap": _store.state.quoteData.data[crypto].quote.USD.market_cap,
              "market_cap_perc": _store.state.quoteData.data[crypto].quote.USD.market_cap / _store.state.metaData.data.quote.USD.total_market_cap * 100
            }
            _store.commit("addTransfData", newData)
          }
          let otherData = {
            "id": 0,
            "name": "Other",
            "symbol": "Other",
            "price": NaN,
            "slug": "other",
            "market_cap": _store.state.metaData.data.quote.USD.total_market_cap,
            "market_cap_perc": (_store.state.metaData.data.quote.USD.total_market_cap - _store.state.marketCapShown) / _store.state.metaData.data.quote.USD.total_market_cap * 100
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
            .attr("fill", "#53b3cbff")
            .on("mouseover", function(d) {
              d3.select(this)
                .transition()
                .duration(200)
                .attr("opacity", 0.6);
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
                        ${formatter_dec.format(d.originalTarget.__data__.data.price)}
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
                    <tr>
                      <td>
                        Market Cap:
                      </td>
                      <td>
                          ${d.originalTarget.__data__.data.market_cap_perc.toFixed(2)}%
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

          svg.selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .selectAll("tspan")
            .data(d => {
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
            .attr("font-size", "0.9em")
            .attr("fill", "white");
          resolve("tree map build")
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "./src/styles/variables.scss";

#tooltip {
  position: absolute;
  text-align: left;
  padding: .5rem;
  background: #FFFFFF;
  color: $rich-black-fogra-29;
  border: 1px solid $yale-blue;
  opacity: 0;
  border-radius: 2px;
  pointer-events: none;
  font-size: 0.9rem;
}

.lds-wrapper {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform: -webkit-translate(-50%, -50%);
  transform: -moz-translate(-50%, -50%);
  transform: -ms-translate(-50%, -50%);
}

.lds-hourglass {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-hourglass:after {
  content: " ";
  display: block;
  border-radius: 50%;
  width: 0;
  height: 0;
  margin: 8px;
  box-sizing: border-box;
  border: 32px solid $antique-ruby;
  border-color: $antique-ruby transparent $antique-ruby transparent;
  animation: lds-hourglass 1.2s infinite;
}
@keyframes lds-hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
}

.svg-wrapper {
  padding: 10px;
}

</style>
