/******DRAW TEMPERATURE CHART*******/

function createTempChart(dataset) {

  //Set margins, height and width
  var width, height, margin = {},
    chartWidth, chartHeight;

  margin = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 50
  };

  chartWidth = 380 - margin.left - margin.right;
  chartHeight = 110 - margin.top - margin.bottom;

  width = chartWidth + margin.left + margin.right;
  height = chartHeight + margin.top + margin.bottom;

  //Transform temps data to the right format
  dataset.forEach(function (d) {
    d.day = (new Date(d.day));
    d.max = +d.max;
    d.min = +d.min;
  });

  var timeFormat = d3.time.format('%a %d');

  //Define x and y scales and domains
  var x = d3.time.scale()
    .range([0, chartWidth]);

  var y = d3.scale.linear()
    .range([chartHeight, 0]);

  x.domain(d3.extent(dataset, function (d) {
    return new Date(d.day);
  }));

  var maxY = d3.max(dataset, function (d) {
    return d.max;
  });
  var minY = d3.min(dataset, function (d) {
    return d.min;
  });

  y.domain([minY, maxY]);

  //Define the svg element
  var graph = d3.select("#graph").append("svg")
    .attr("width", "100%").attr("height", "100%")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMinYMid meet")
    .append("g")
    .attr("transform", "translate(30, 30)");

  //Draw Lines
  var line = d3.svg.line()
    .interpolate("linear")
    .x(function (d) {
      return x(new Date(d.day));
    })
    .y(function (d) {
      return y(d.max);
    });

  var line2 = d3.svg.line()
    .interpolate("cardinal")
    .x(function (d) {
      return x(d.day)
    })
    .y(function (d) {
      return y(d.min)
    });

  //Max temperature
  var path = graph.append("path")
    .data([dataset])
    .attr("class", "line")
    .attr("d", line)
    .attr("stroke", "#D39323")
    .attr("stroke-width", 1.0)
    .attr("fill", "none");
  //Min temperature
  var path2 = graph.append("path")
    .data([dataset])
    .attr("class", "line")
    .attr("d", line2)
    .attr("stroke", "#23C3D3")
    .attr("stroke-width", 1.0)
    .attr("fill", "none");

  //Make it responsive
  var totalLength = path.node().getTotalLength(),
    totalLength2 = path2.node().getTotalLength();

  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(1000)
    .ease("linear")
    .attr("stroke-dashoffset", 0);

  path2
    .attr("stroke-dasharray", totalLength2 + " " + totalLength2)
    .attr("stroke-dashoffset", totalLength2)
    .transition()
    .duration(1000)
    .ease("linear")
    .attr("stroke-dashoffset", 0);

  //Draw Dots
  graph.selectAll("dot")
    .data([dataset])
    .enter().append("g")
    .attr("class", "dot")
    .selectAll("circle")
    .data(function (d) {
      return d;
    })
    .enter().append("circle")
    .attr("r", 4.5)
    .attr("fill", "#D39323")
    .attr("cx", function (d, i) {
      return x(d.day);
    })
    .attr("cy", function (d, i) {
      return y(d.max);
    })
    .on("mouseover", function () {
      d3.select(this)
        .attr("r", 5.5);
    })
    .on("mouseout", function () {
      d3.select(this)
        .attr("r", 4);
    });

  graph.selectAll("dot")
    .data([dataset])
    .enter().append("g")
    .attr("class", "dot")
    .selectAll("circle")
    .data(function (d) {
      return d;
    })
    .enter().append("circle")
    .attr("r", 4.5)
    .attr("fill", "#23C3D3")
    .attr("cx", function (d, i) {
      return x(d.day);
    })
    .attr("cy", function (d, i) {
      return y(d.min);
    })
    .on("mouseover", function () {
      d3.select(this)
        .attr("r", 5.5);
    })
    .on("mouseout", function () {
      d3.select(this)
        .attr("r", 4.5);
    });

  //Show temperature labels with the dots
  graph.selectAll("label")
    .data([dataset])
    .enter().append("g")
    .attr("class", "label")
    .selectAll("text")
    .data(function (d) {
      return d;
    })
    .enter().append("text")
    .attr("x", function (d, i) {
      return x(d.day);
    })
    .attr("y", function (d, i) {
      return y(d.max);
    })
    .attr("dx", "-.3em")
    .attr("dy", "-.65em")
    .attr("fill", "#D39323")
    .text(function (d) {
      return d.max;
    });

  graph.selectAll("label")
    .data([dataset])
    .enter().append("g")
    .attr("class", "label")
    .selectAll("text")
    .data(function (d) {
      return d;
    })
    .enter().append("text")
    .attr("x", function (d, i) {
      return x(d.day);
    })
    .attr("y", function (d, i) {
      return y(d.min);
    })
    .attr("dx", "-.3em")
    .attr("dy", "1.2em")
    .attr("fill", "#23C3D3")
    .text(function (d) {
      return d.min;
    });

  $(".label text").append("&deg;");

  //END CHART
}
