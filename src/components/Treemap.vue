<template>
  <div id="body">
    <div id="treemap"></div>
    <div id="tooltip"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
// import datajson from "../assets/data.json"; 

export default {
  name: 'Treemap',

  mounted() {
    this.treemap();
  },

  methods: {
    treemap() {
      // TODO: refactor to vuex
      // TODO: build REST API
      const cmc_key = process.env.VUE_APP_COIN;
      const rp = require('request-promise');
      let apiData
      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
          'start': '1',
          'limit': '50',
          'convert': 'USD'
        },
        headers: {
          'X-CMC_PRO_API_KEY': cmc_key,
        },
        json: true,
        gzip: true
      };

      rp(requestOptions).then(response => {
        apiData = response
        console.log('API call response:', response);
      }).then(generateTree).catch((err) => {
        console.log('API call error:', err.message);
      });

      // Create number formatter
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });
      
      function generateTree() {
        let data = {"name": "crypto", "children": []}
        for (let crypto = 0; crypto < apiData.data.length; crypto++) {
          data.children.push({
            "id": apiData.data[crypto].id,
            "name": apiData.data[crypto].name,
            "symbol": apiData.data[crypto].symbol,
            "slug": apiData.data[crypto].slug,
            "market_cap": apiData.data[crypto].quote.USD.market_cap
          })
        }
        
        const w = window.innerWidth;
        const h = window.innerHeight - 50;

        const hierarchy = d3.hierarchy(data)
          .sum(d=>d.market_cap)
          .sort((a, b) => b.market_cap - a.market_cap);

        const treemap = d3.treemap()
          .size([w, h])
          .padding(1)

        const root = treemap(hierarchy);

        const svg = d3.select("#treemap")
          .append("svg")
          .attr("viewBox", [0, 0, w, h])
        
        // d3.select('#body')
        //   .append('div')
        //   .attr('id', 'tooltip')
        //   .attr('style', 'position: absolute; opacity: 0;');

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
            d3.select('#tooltip')
              .transition()
              .duration(200)
              .style('opacity', 1)
              .text(`${d.originalTarget.__data__.data.name} - Market Cap: ${formatter.format(d.originalTarget.__data__.data.market_cap)}`)
          }).on("mouseout", function() {
              d3.select(this)
                .transition()
                .duration(200)
                .attr("opacity", 1);
              d3.select('#tooltip')
                .style('opacity', 0)
          }).on('mousemove', function() {
            d3.select('#tooltip')
              .style('left', (event.x + 10) + 'px')
              .style('top', (event.y + 10) + 'px')
          })

        svg.selectAll('text')
          .data(root.leaves())
          .enter()
          .append('text')
          .selectAll('tspan')
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
          .append('tspan')
          .attr("x", (d) => d.x0 + 5)
          .attr("y", (d, i) => d.y0 + 15 + (i * 10))       // offset by index 
          .text((d) => d.text)
          .attr("font-size", "0.8em")
          .attr("fill", "white");
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#tooltip {
  position: absolute;
  text-align: center;
  padding: .5rem;
  background: #FFFFFF;
  color: #313639;
  border: 1px solid #8c00ff;
  border-radius: 8px;
  pointer-events: none;
  font-size: 0.9rem;
}
</style>
