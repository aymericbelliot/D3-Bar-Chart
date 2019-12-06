// Data source
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

/************************************
 * JSON request to load data from url
 ************************************/
document.addEventListener('DOMContentLoaded', () => {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      populateBarChart("#charBar", data.data);
    })
});

/************************************
 * Creat bar chart from dataset
 ************************************/
populateBarChart = (id, dataset) => {
  // Define w/h/p ratio
  const w = 1000;
  const h = 500;
  const padding = 50;

  // Define scaling functions
  const xScale = d3.scaleLinear()
    .domain([d3.min(dataset, (d, i) => d[0]).slice(0, 4), d3.max(dataset, (d, i) => d[0]).slice(0, 4)])
    .range([padding, w - padding]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, (d, i) => d[1])])
    .range([h - padding, padding]);

  // Create SVG layout
  const svg = d3.select(id)
    .append("svg")
    .attr("viewBox", "0 0 " + w + " " + h)

  // Create Axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis)
    .attr("id", "x-axis");

  svg.append("g")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis)
    .attr("id", "y-axis");

  // Add y axis label
  svg.append("text")
    .attr("x", - h / 2 - padding)
    .attr("y", padding + 30)
    .attr("transform", "rotate(270)")
    .text("Gross Domestic product");

  // Create bars 
  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(d[0].slice(0, 4) + "." + (d[0].slice(5, 7) - 1) * 100 / 12))
    .attr("y", (d, i) => yScale(d[1]))
    .attr("width", (d, i) => (w - 2 * padding) / dataset.length)
    .attr("height", (d, i) => h - padding - yScale(d[1]))
    .attr("class", "bar")
    .attr("data_date", (d, i) => d[0])
    .attr("data_gdp", (d, i) => d[1])
    .append("title")
    .text(d => d[0].slice(0, 4) + " Q" + ((d[0].slice(5, 7) - 1) / 3 + 1) + "\n$ " + d[1] + " Billion");
}
