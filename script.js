// script.js

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. 加载所有图表
    const charts = [
        { id: '#vis1', url: 'graphs/weather_analysis.json' },
        { id: '#vis2', url: 'graphs/weather_analysis1.json' },
        { id: '#vis4', url: 'graphs/weather_analysis4.json' },
    ];

    charts.forEach(function(chart) {
        if (document.querySelector(chart.id)) {
            vegaEmbed(chart.id, chart.url, {
                actions: false,
                renderer: 'canvas'   
                // width: "container" 
            }).catch(console.error);
        }
    });

    loadBoxPlot();

});

function loadBoxPlot() {
    d3.csv("key_bus_weather.csv").then(function(data) {
        const clear = [];
        const rainy = [];
        const snowy = [];
      
        data.forEach(row => {
          const rate = parseFloat(row.on_time_rate);
          if (isNaN(rate)) return;
      
          if (row.weather_cat === "Clear") {
            clear.push(rate);
          } else if (row.weather_cat === "Rainy") {
            rainy.push(rate);
          } else if (row.weather_cat === "Snowy") {
            snowy.push(rate);
          }
        });
      
        const traceClear = {
          y: clear,
          type: "box",
          name: "Clear",
          boxpoints: "outliers",
          marker: { color: "#333333" },   
          line:   { color: "#333333" }    
        };
      
        const traceRainy = {
          y: rainy,
          type: "box",
          name: "Rainy",
          boxpoints: "outliers",
          marker: { color: "#CC0000" }, // NEU Red
          line:   { color: "#CC0000" }
        };
      
        const traceSnowy = {
          y: snowy,
          type: "box",
          name: "Snowy",
          boxpoints: "outliers",
          marker: { color: "#A0CBE8" }, // Ice Blue
          line:   { color: "#A0CBE8" }
        };
      
        const dataTraces = [traceClear, traceRainy, traceSnowy];
      
        const layout = {
          yaxis: {
            title: "On-time Rate",
            tickformat: ".0%",   
            range: [0.2, 1]      
          },
          xaxis: {
            title: "Weather Type"
          },
          boxmode: "group",

          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          margin: { t: 40, l: 80, r: 40, b: 80 }
        };
      
        // 注意：这里的 ID 改成了 'vis5'，对应 HTML
        Plotly.newPlot("vis3", dataTraces, layout, {responsive: true});

    }).catch(function(error) {
        console.error("Error loading or plotting data:", error);
    });
}

// 2. Tab Switching Logic
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // A. 隐藏所有 tab-content
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // B. 移除所有按钮的 active 类
    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // C. 显示当前 tab
    document.getElementById(tabName).style.display = "block";

    // D. 当前按钮设为 active
    evt.currentTarget.className += " active";

    // E. 触发一次 resize，让 Vega 重新计算宽度
    setTimeout(function() {
        window.dispatchEvent(new Event('resize'));
    }, 10);

    etTimeout(function() {
        window.dispatchEvent(new Event('resize'));
        if (tabName === 'tab3') {
            Plotly.Plots.resize('vis3');
        }
    }, 10);
}

