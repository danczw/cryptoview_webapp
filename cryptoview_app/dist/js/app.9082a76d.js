(function(t){function e(e){for(var n,r,u=e[0],i=e[1],s=e[2],p=0,l=[];p<u.length;p++)r=u[p],Object.prototype.hasOwnProperty.call(o,r)&&o[r]&&l.push(o[r][0]),o[r]=0;for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n]);d&&d(e);while(l.length)l.shift()();return c.push.apply(c,s||[]),a()}function a(){for(var t,e=0;e<c.length;e++){for(var a=c[e],n=!0,r=1;r<a.length;r++){var u=a[r];0!==o[u]&&(n=!1)}n&&(c.splice(e--,1),t=i(i.s=a[0]))}return t}var n={},r={app:0},o={app:0},c=[];function u(t){return i.p+"js/"+({about:"about"}[t]||t)+"."+{about:"22355e58"}[t]+".js"}function i(e){if(n[e])return n[e].exports;var a=n[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,i),a.l=!0,a.exports}i.e=function(t){var e=[],a={about:1};r[t]?e.push(r[t]):0!==r[t]&&a[t]&&e.push(r[t]=new Promise((function(e,a){for(var n="css/"+({about:"about"}[t]||t)+"."+{about:"9014e6b4"}[t]+".css",o=i.p+n,c=document.getElementsByTagName("link"),u=0;u<c.length;u++){var s=c[u],p=s.getAttribute("data-href")||s.getAttribute("href");if("stylesheet"===s.rel&&(p===n||p===o))return e()}var l=document.getElementsByTagName("style");for(u=0;u<l.length;u++){s=l[u],p=s.getAttribute("data-href");if(p===n||p===o)return e()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.onload=e,d.onerror=function(e){var n=e&&e.target&&e.target.src||o,c=new Error("Loading CSS chunk "+t+" failed.\n("+n+")");c.code="CSS_CHUNK_LOAD_FAILED",c.request=n,delete r[t],d.parentNode.removeChild(d),a(c)},d.href=o;var m=document.getElementsByTagName("head")[0];m.appendChild(d)})).then((function(){r[t]=0})));var n=o[t];if(0!==n)if(n)e.push(n[2]);else{var c=new Promise((function(e,a){n=o[t]=[e,a]}));e.push(n[2]=c);var s,p=document.createElement("script");p.charset="utf-8",p.timeout=120,i.nc&&p.setAttribute("nonce",i.nc),p.src=u(t);var l=new Error;s=function(e){p.onerror=p.onload=null,clearTimeout(d);var a=o[t];if(0!==a){if(a){var n=e&&("load"===e.type?"missing":e.type),r=e&&e.target&&e.target.src;l.message="Loading chunk "+t+" failed.\n("+n+": "+r+")",l.name="ChunkLoadError",l.type=n,l.request=r,a[1](l)}o[t]=void 0}};var d=setTimeout((function(){s({type:"timeout",target:p})}),12e4);p.onerror=p.onload=s,document.head.appendChild(p)}return Promise.all(e)},i.m=t,i.c=n,i.d=function(t,e,a){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(i.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(a,n,function(e){return t[e]}.bind(null,n));return a},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/",i.oe=function(t){throw console.error(t),t};var s=window["webpackJsonp"]=window["webpackJsonp"]||[],p=s.push.bind(s);s.push=e,s=s.slice();for(var l=0;l<s.length;l++)e(s[l]);var d=p;c.push([0,"chunk-vendors"]),a()})({0:function(t,e,a){t.exports=a("56d7")},"0270":function(t,e,a){},1725:function(t){t.exports=JSON.parse('{"data":[{"id":1,"name":"Bitcoin","symbol":"BTC","slug":"bitcoin","cmc_rank":5,"num_market_pairs":500,"circulating_supply":16950100,"total_supply":16950100,"max_supply":21000000,"last_updated":"2018-06-02T22:51:28.209Z","date_added":"2013-04-28T00:00:00.000Z","tags":["mineable"],"platform":null,"quote":{"USD":{"price":9283.92,"volume_24h":7155680000,"percent_change_1h":-0.152774,"percent_change_24h":0.518894,"percent_change_7d":0.986573,"market_cap":158055024432,"last_updated":"2018-08-09T22:53:32.000Z"},"BTC":{"price":1,"volume_24h":772012,"percent_change_1h":0,"percent_change_24h":0,"percent_change_7d":0,"market_cap":17024600,"last_updated":"2018-08-09T22:53:32.000Z"}}},{"id":2,"name":"Ethereum","symbol":"ETH","slug":"ethereum","cmc_rank":4,"num_market_pairs":400,"circulating_supply":110950100,"total_supply":110950100,"max_supply":110950100,"last_updated":"2018-06-02T22:51:28.209Z","date_added":"2013-04-28T00:00:00.000Z","tags":["mineable"],"platform":null,"quote":{"USD":{"price":1283.92,"volume_24h":7155680000,"percent_change_1h":-0.152774,"percent_change_24h":0.518894,"percent_change_7d":0.986573,"market_cap":108055024432,"last_updated":"2018-08-09T22:53:32.000Z"},"BTC":{"price":1,"volume_24h":772012,"percent_change_1h":0,"percent_change_24h":0,"percent_change_7d":0,"market_cap":17024600,"last_updated":"2018-08-09T22:53:32.000Z"}}}],"status":{"timestamp":"2018-06-02T22:51:28.209Z","error_code":0,"error_message":"","elapsed":10,"credit_count":1}}')},"40b4":function(t,e,a){"use strict";a("99d2")},"556e":function(t){t.exports=JSON.parse('{"data":{"btc_dominance":67.0057,"eth_dominance":9.02205,"active_cryptocurrencies":2941,"total_cryptocurrencies":4637,"active_market_pairs":21209,"active_exchanges":445,"total_exchanges":677,"last_updated":"2019-05-16T18:47:00.000Z","quote":{"USD":{"total_market_cap":250385096532.124,"total_volume_24h":119270642406.968,"total_volume_24h_reported":1514905418.39087,"altcoin_volume_24h":119270642406.968,"altcoin_volume_24h_reported":1514905418.39087,"altcoin_market_cap":250385096532.124,"last_updated":"2019-05-16T18:47:00.000Z"}}},"status":{"timestamp":"2021-05-15T07:54:21.279Z","error_code":0,"error_message":"","elapsed":10,"credit_count":1}}')},"56d7":function(t,e,a){"use strict";a.r(e);a("e260"),a("e6cf"),a("cca6"),a("a79d");var n=a("7a23"),r={id:"nav"},o=Object(n["f"])("Home"),c=Object(n["f"])(" | "),u=Object(n["f"])("About");function i(t,e){var a=Object(n["v"])("router-link"),i=Object(n["v"])("router-view");return Object(n["p"])(),Object(n["d"])(n["a"],null,[Object(n["g"])("div",r,[Object(n["g"])(a,{to:"/"},{default:Object(n["z"])((function(){return[o]})),_:1}),c,Object(n["g"])(a,{to:"/about"},{default:Object(n["z"])((function(){return[u]})),_:1})]),Object(n["g"])(i)],64)}a("40b4");const s={};s.render=i;var p=s,l=(a("d3b7"),a("3ca3"),a("ddb0"),a("6c02")),d={class:"home"};function m(t,e,a,r,o,c){var u=Object(n["v"])("Treemap");return Object(n["p"])(),Object(n["d"])("div",d,[Object(n["g"])(u)])}var f=Object(n["A"])("data-v-d21a124c");Object(n["s"])("data-v-d21a124c");var _={id:"body"},h={class:"lds-wrapper"},b={key:0,class:"lds-hourglass"},g=Object(n["g"])("div",{class:"svg-wrapper"},[Object(n["g"])("div",{id:"treemap"})],-1),v=Object(n["g"])("div",{id:"tooltip"},null,-1);Object(n["q"])();var y=f((function(t,e,a,r,o,c){return Object(n["p"])(),Object(n["d"])("div",_,[Object(n["g"])("div",h,[t.loading?(Object(n["p"])(),Object(n["d"])("div",b)):Object(n["e"])("",!0)]),g,v])})),k=a("1da1"),O=(a("96cf"),a("b0c0"),a("99af"),a("b680"),a("d81d"),a("ac1f"),a("1276"),a("5698")),w=a("5502"),D=a("bc3a"),j=a.n(D),x=a("1725"),T=a("556e"),S={name:"Treemap",setup:function(){var t=Object(w["b"])();return{store:t}},data:function(){return{loading:!1}},mounted:function(){this.treemap()},methods:{treemap:function(){this.loading=!0;var t=this,e=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}),a=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2});function n(t){return r.apply(this,arguments)}function r(){return r=Object(k["a"])(regeneratorRuntime.mark((function e(a){var n,r,c,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,o(a);case 3:return n=e.sent,console.log("Why is this "+n),e.next=7,u(a);case 7:return r=e.sent,console.log("Why is this "+r),e.next=11,s(a);case 11:return c=e.sent,console.log(c),e.next=15,p(a);case 15:i=e.sent,console.log(i),e.next=22;break;case 19:e.prev=19,e.t0=e["catch"](0),console.log(e.t0);case 22:t.loading=!1;case 23:case"end":return e.stop()}}),e,null,[[0,19]])}))),r.apply(this,arguments)}function o(t){return c.apply(this,arguments)}function c(){return c=Object(k["a"])(regeneratorRuntime.mark((function t(e){var a,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return a="https://cryptoview.azurewebsites.net/quotes/",t.prev=1,t.next=4,j()("".concat(a));case 4:n=t.sent,e.commit("setQuoteData",n),t.next=12;break;case 8:t.prev=8,t.t0=t["catch"](1),e.commit("setQuoteData",x),console.log(t.t0);case 12:case"end":return t.stop()}}),t,null,[[1,8]])}))),c.apply(this,arguments)}function u(t){return i.apply(this,arguments)}function i(){return i=Object(k["a"])(regeneratorRuntime.mark((function t(e){var a,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return a="https://cryptoview.azurewebsites.net/meta/",t.prev=1,t.next=4,j()("".concat(a));case 4:n=t.sent,e.commit("setMetaData",n),t.next=12;break;case 8:t.prev=8,t.t0=t["catch"](1),e.commit("setMetaData",T),console.log(t.t0);case 12:case"end":return t.stop()}}),t,null,[[1,8]])}))),i.apply(this,arguments)}function s(t){return t.commit("resetTransfData"),new Promise((function(e){t.commit("resetMarketCapShown");for(var a=0;a<t.state.quoteData.data.length;a++){t.commit("addMarketCapShown",t.state.quoteData.data[a].quote.USD.market_cap);var n={id:t.state.quoteData.data[a].id,name:t.state.quoteData.data[a].name,symbol:t.state.quoteData.data[a].symbol,price:t.state.quoteData.data[a].quote.USD.price,slug:t.state.quoteData.data[a].slug,market_cap:t.state.quoteData.data[a].quote.USD.market_cap,market_cap_perc:t.state.quoteData.data[a].quote.USD.market_cap/t.state.metaData.data.quote.USD.total_market_cap*100};t.commit("addTransfData",n)}var r={id:0,name:"Other",symbol:"Other",price:NaN,slug:"other",market_cap:t.state.metaData.data.quote.USD.total_market_cap,market_cap_perc:(t.state.metaData.data.quote.USD.total_market_cap-t.state.marketCapShown)/t.state.metaData.data.quote.USD.total_market_cap*100};t.commit("addTransfData",r),e("data transformed")}))}function p(t){return new Promise((function(n){var r=window.innerWidth,o=window.innerHeight-50,c=O["a"](t.state.transfData).sum((function(t){return t.market_cap})).sort((function(t,e){return e.market_cap-t.market_cap})),u=O["c"]().size([r,o]).padding(1),i=u(c),s=O["b"]("#treemap").append("svg").attr("viewBox",[0,0,r,o]);s.selectAll("rect").data(i.leaves()).enter().append("rect").attr("x",(function(t){return t.x0})).attr("y",(function(t){return t.y0})).attr("width",(function(t){return t.x1-t.x0})).attr("height",(function(t){return t.y1-t.y0})).attr("fill","#53b3cbff").on("mouseover",(function(t){O["b"](this).transition().duration(200).attr("opacity",.6),O["b"]("#tooltip").transition().duration(200).style("opacity",1),O["b"]("#tooltip").html("\n                  <table>\n                    <tr>\n                      <th>\n                        ".concat(t.originalTarget.__data__.data.name,"</br>\n                      </th>\n                    </tr>\n                    <tr>\n                      <td>\n                        Quote:\n                      </td>\n                      <td>\n                        ").concat(a.format(t.originalTarget.__data__.data.price),"\n                      </td>\n                    </tr>\n                    <tr>\n                      <td>\n                        Market Cap:\n                      </td>\n                      <td>\n                          ").concat(e.format(t.originalTarget.__data__.data.market_cap),"\n                      </td>\n                    </tr>\n                    <tr>\n                      <td>\n                        Market Cap:\n                      </td>\n                      <td>\n                          ").concat(t.originalTarget.__data__.data.market_cap_perc.toFixed(2),"%\n                      </td>\n                    </tr>\n                  </table>"))})).on("mouseout",(function(){O["b"](this).transition().duration(200).attr("opacity",1),O["b"]("#tooltip").style("opacity",0)})).on("mousemove",(function(){O["b"]("#tooltip").style("left",event.x+10+"px").style("top",event.y+10+"px")})),s.selectAll("text").data(i.leaves()).enter().append("text").selectAll("tspan").data((function(t){return t.data.symbol.split(/(?=[A-Z][^A-Z])/g).map((function(e){return{text:e,x0:t.x0,y0:t.y0}}))})).enter().append("tspan").attr("x",(function(t){return t.x0+5})).attr("y",(function(t,e){return t.y0+15+10*e})).text((function(t){return t.text})).attr("font-size","0.9em").attr("fill","white"),n("tree map build")}))}n(this.store)}}};a("5f9d");S.render=y,S.__scopeId="data-v-d21a124c";var q=S,C={name:"Home",components:{Treemap:q}};C.render=m;var U=C,A=[{path:"/",name:"Home",component:U},{path:"/about",name:"About",component:function(){return a.e("about").then(a.bind(null,"f820"))}}],Z=Object(l["a"])({history:Object(l["b"])(),routes:A}),M=Z,P=Object(w["a"])({state:{quoteData:{},metaData:{},transfData:{name:"crypto",children:[]},marketCapShown:0},mutations:{setQuoteData:function(t,e){t.quoteData=e},setMetaData:function(t,e){t.metaData=e},addTransfData:function(t,e){t.transfData.children.push(e)},resetTransfData:function(t){t.transfData={name:"crypto",children:[]}},addMarketCapShown:function(t,e){t.marketCapShown+=e},resetMarketCapShown:function(t){t.marketCapShown=0}},actions:{},modules:{}});Object(n["c"])(p).use(P).use(M).mount("#app")},"5f9d":function(t,e,a){"use strict";a("0270")},"99d2":function(t,e,a){}});
//# sourceMappingURL=app.9082a76d.js.map