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
  beforeUnmount() {
    this.unmountTreemap();
  },

  methods: {
    treemap() {
      var vm = this;
      vm.loading = true;

      // create number formatter
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

      async function viz() {
        try {
          await quotesApi();
          await metaApi();
          
          await transfData();
          await generateTree();

        } catch (error) {
          console.log(error);
        }
        vm.loading = false;
      }
      viz();
      
      async function quotesApi() {
        const apiUrl = "http://localhost:3000/quotes/";
        try {
          let response = await axios(`${ apiUrl }`);
          vm.store.commit("setQuoteData", response);
          return response
        } catch (error) {
          vm.store.commit("setQuoteData", datajson);
          console.log(error);
        }
      }

      async function metaApi() {
        const apiUrl = "http://localhost:3000/meta/";
        try {
          let response = await axios(`${ apiUrl }`);
          vm.store.commit("setMetaData", response);
          return response
        } catch (error) {
          vm.store.commit("setMetaData", metadatajson);
          console.log(error);
        }
      }
      
      function transfData() {
        vm.store.commit("resetTransfData")
        return new Promise((resolve) => {
          vm.store.commit("resetMarketCapShown");
          // TODO: move to backend
          for (let crypto = 0; crypto < vm.store.state.quoteData.data.length; crypto++) {
            vm.store.commit("addMarketCapShown", vm.store.state.quoteData.data[crypto].quote.USD.market_cap);
            let newData = {
              "id": vm.store.state.quoteData.data[crypto].id,
              "name": vm.store.state.quoteData.data[crypto].name,
              "symbol": vm.store.state.quoteData.data[crypto].symbol,
              "price": vm.store.state.quoteData.data[crypto].quote.USD.price,
              "slug": vm.store.state.quoteData.data[crypto].slug,
              "market_cap": vm.store.state.quoteData.data[crypto].quote.USD.market_cap,
              "market_cap_perc": vm.store.state.quoteData.data[crypto].quote.USD.market_cap / vm.store.state.metaData.data.quote.USD.total_market_cap * 100
            }
            vm.store.commit("addTransfData", newData)
          }
          let otherData = {
            "id": 0,
            "name": "Other",
            "symbol": "Other",
            "price": NaN,
            "slug": "other",
            "market_cap": vm.store.state.metaData.data.quote.USD.total_market_cap - vm.store.state.marketCapShown,
            "market_cap_perc": (vm.store.state.metaData.data.quote.USD.total_market_cap - vm.store.state.marketCapShown) / vm.store.state.metaData.data.quote.USD.total_market_cap * 100
          }
          vm.store.commit("addTransfData", otherData)
          resolve("data transformed")
        })
      }

      function generateTree() {
        return new Promise((resolve) => {
          const w = window.innerWidth;
          const h = window.innerHeight - 50;

          const hierarchy = d3.hierarchy(vm.store.state.transfData)
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
                        ${d.target.__data__.data.name}</br>
                      </th>
                    </tr>
                    <tr>
                      <td>
                        Quote:
                      </td>
                      <td>
                        ${formatter_dec.format(d.target.__data__.data.price)}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Market Cap:
                      </td>
                      <td>
                        ${formatter.format(d.target.__data__.data.market_cap)}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Market Cap:
                      </td>
                      <td>
                        ${d.target.__data__.data.market_cap_perc.toFixed(2)}%
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
    },

    unmountTreemap() {
      const svg = d3.select("#treemap")
      svg.selectAll('*').remove();
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
