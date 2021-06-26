<template>
  <div id="body">
    <div class="time_wrapper">
      <button class="time_button" :class="{'time_active': localTimeFrame === 'change_1h'}" v-on:click="setTimeFrame('change_1h'); updateTreemap();">1h</button> /
      <button class="time_button" :class="{'time_active': localTimeFrame === 'change_24h'}" v-on:click="setTimeFrame('change_24h'); updateTreemap();">24h</button> /
      <button class="time_button" :class="{'time_active': localTimeFrame === 'change_7d'}" v-on:click="setTimeFrame('change_7d'); updateTreemap();">7d</button>
    </div>
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
import { mapGetters, useStore } from "vuex";
import axios from "axios"

// TODO: remove when API is implemented
import datajson from "../assets/data.json";

export default {
  name: "Treemap",
  
  setup() {
    const store = useStore();
    return { store }
  },

  data: () => ({
    loading: false
  }),

  computed: {
    ...mapGetters({
      localTimeFrame: 'getTimeFrame',
      localQuoteData: 'getQuoteData'
    })
  },

  // TODO: keep tree active
  mounted() {
    this.generateTreemap();
  },

  beforeUnmount() {
    this.unmountTreemap();
  },

  methods: {
    generateTreemap() {
      const svg = d3.select("#treemap")
      svg.selectAll('*').remove();
      
      const vm = this;
      vm.loading = true;

      // TODO: move to mixin
      // create number formatter
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      });

      // TODO: move to mixin
      const formatter_dec = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2
      });
      
      async function quotesApi() {
        const apiUrl = "https://cryptoview-beta.azurewebsites.net/quotes/";
        
        try {
          let response = await axios(`${ apiUrl }`);

          for (let crypto = 0; crypto < response.data.quotes[0].length; crypto++) {
            vm.store.commit("setQuoteData", response.data.quotes[0][crypto]);
          }
          vm.store.commit("setMetaData", response.data.meta);

          return response
        } catch (error) {
          vm.store.commit("setQuoteData", datajson);
          console.log(error);
        }
      }

      function generateTree() {
        return new Promise((resolve) => {
          const w = window.innerWidth;
          const h = window.innerHeight - 50;

          // TODO: move to mixin
          const colorScale = d3.scaleSequential()
            .domain([-15, 15])
            .range(['#77262dff', '#63ff00']);

          const hierarchy = d3.hierarchy(vm.localQuoteData)
            .sum(d => d.market_cap)
            .sort((a, b) => b.market_cap - a.market_cap);

          const treemap = d3.treemap()
            .size([w, h])
            .padding(1);

          const root = treemap(hierarchy);

          const svg = d3.select("#treemap")
            .append("svg")
            .attr("viewBox", [0, 0, w, h]);

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
                .style("left", function() {
                  if(event.x < w/1.2) {
                    return (event.x + 10) + "px"
                  } else {
                    return (event.x - 220) + "px"
                  }
                })
                .style("top", function() {
                  if(event.y < h/1.1) {
                    return (event.y + 10) + "px"
                  } else {
                    return (event.y - 100) + "px"
                  }
                })
            });

          svg.selectAll("rect")
            .attr("fill", function(d) {
              if(d.data.name === "Other") {
                return "#ab9c9eff"
              } else {
                switch(vm.localTimeFrame) {
                  case "change_1h":
                    return colorScale(d.data.percent_change_1h);
                  case "change_24h":
                    return colorScale(d.data.percent_change_24h);
                  case "change_7d":
                    return colorScale(d.data.percent_change_7d);
                  default:
                    return "#53b3cbff";
                }
              }
            });

          svg.selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .selectAll("tspan")
            .data(d => {
              return d.data.symbol.split(/(?=[A-Z][^A-Z])/g)
                .map(v => {
                  return {
                    symbol: v,
                    x0: d.x0,
                    y0: d.y0,
                    percent_change_1h: d.data.percent_change_1h,
                    percent_change_24h: d.data.percent_change_24h,
                    percent_change_7d: d.data.percent_change_7d
                  }
                });
            })
            .enter()
            .append("tspan")
            .attr("x", (d) => d.x0 + 5)
            .attr("y", (d, i) => d.y0 + 15 + (i * 10))
            .text((d) => { return d.symbol})
            .attr("font-size", "0.9em")
            .attr("fill", "white")
            
            .append("tspan")
            .attr("x", (d) => d.x0 + 5)
            .attr("y", (d, i) => d.y0 + 35 + (i * 10))
            .text((d) => {
              if(d.symbol === "Other") {
                return ""
              } else {
                switch(vm.localTimeFrame) {
                  case "change_1h":
                    return `${d.percent_change_1h.toFixed(2)}%`;
                  case "change_24h":
                    return `${d.percent_change_24h.toFixed(2)}%`;
                  case "change_7d":
                    return `${d.percent_change_7d.toFixed(2)}%`;
                  default:
                    return `${d.symbol}`;
                }
              }  
            })
            .attr("font-size", "0.9em")
            .attr("fill", "white");

          resolve("tree map build");
        })
      }

      async function viz() {
        try {
          vm.store.commit("resetQuoteData");

          await quotesApi();
          await generateTree();

        } catch (error) {
          console.log(error);
        }
        vm.loading = false;
      }
      viz();
    },

    updateTreemap() {
      const svg = d3.select("#treemap");
      svg.selectAll('*').remove();
      
      const vm = this;
      vm.loading = true;
      
      // TODO: move to mixin
      // create number formatter
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      });

      // TODO: move to mixin
      const formatter_dec = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2
      });

      function generateTree() {
        return new Promise((resolve) => {
          const w = window.innerWidth;
          const h = window.innerHeight - 50;

          // TODO: move to mixin
          const colorScale = d3.scaleSequential()
            .domain([-15, 15])
            .range(['#77262dff', '#63ff00']);

          const hierarchy = d3.hierarchy(vm.localQuoteData)
            .sum(d => d.market_cap)
            .sort((a, b) => b.market_cap - a.market_cap);

          const treemap = d3.treemap()
            .size([w, h])
            .padding(1);

          const root = treemap(hierarchy);

          const svg = d3.select("#treemap")
            .append("svg")
            .attr("viewBox", [0, 0, w, h]);

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
                .style("left", function() {
                  if(event.x < w/1.2) {
                    return (event.x + 10) + "px"
                  } else {
                    return (event.x - 220) + "px"
                  }
                })
                .style("top", function() {
                  if(event.y < h/1.1) {
                    return (event.y + 10) + "px"
                  } else {
                    return (event.y - 100) + "px"
                  }
                })
            });

          svg.selectAll("rect")
            .attr("fill", function(d) {
              if(d.data.name === "Other") {
                return "#ab9c9eff"
              } else {
                switch(vm.localTimeFrame) {
                  case "change_1h":
                    return colorScale(d.data.percent_change_1h);
                  case "change_24h":
                    return colorScale(d.data.percent_change_24h);
                  case "change_7d":
                    return colorScale(d.data.percent_change_7d);
                  default:
                    return "#53b3cbff";
                }
              }
            });

          svg.selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .selectAll("tspan")
            .data(d => {
              return d.data.symbol.split(/(?=[A-Z][^A-Z])/g)
                .map(v => {
                  return {
                    symbol: v,
                    x0: d.x0,
                    y0: d.y0,
                    percent_change_1h: d.data.percent_change_1h,
                    percent_change_24h: d.data.percent_change_24h,
                    percent_change_7d: d.data.percent_change_7d
                  }
                });
            })
            .enter()
            .append("tspan")
            .attr("x", (d) => d.x0 + 5)
            .attr("y", (d, i) => d.y0 + 15 + (i * 10))
            .text((d) => { return d.symbol})
            .attr("font-size", "0.9em")
            .attr("fill", "white")
            
            .append("tspan")
            .attr("x", (d) => d.x0 + 5)
            .attr("y", (d, i) => d.y0 + 35 + (i * 10))
            .text((d) => {
              if(d.symbol === "Other") {
                return ""
              } else {
                switch(vm.localTimeFrame) {
                  case "change_1h":
                    return `${d.percent_change_1h.toFixed(2)}%`;
                  case "change_24h":
                    return `${d.percent_change_24h.toFixed(2)}%`;
                  case "change_7d":
                    return `${d.percent_change_7d.toFixed(2)}%`;
                  default:
                    return `${d.symbol}`;
                }
              }  
            })
            .attr("font-size", "0.9em")
            .attr("fill", "white");

          resolve("tree map build");
        })
      }

      async function viz() {
        try {
          await generateTree();
        } catch (error) {
          console.log(error);
        }
        vm.loading = false;
      }
      viz();
    },

    unmountTreemap() {
      const svg = d3.select("#treemap")
      svg.selectAll('*').remove();
    },

    setTimeFrame(_value) {
      this.store.commit("setTimeFrame", _value);
      this.localTimeFrame = _value;
    },
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
  background-color: white;
  border: 2px solid $yale-blue;
  opacity: 0;
  border-radius: 2px;
  pointer-events: none;
  font-size: 0.9rem;
}

.time_wrapper {
  width: 120px;
  top: 0;
  right: 0;
  position: absolute;
  color: $black-shadows;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  .time_button {
    background-color: transparent;
    color: $black-shadows;
    font-size: 14px;
    border: none;
    border-radius: 2px;
  }

  .time_active {
    border-bottom: 1px solid $black-shadows;
  }
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
