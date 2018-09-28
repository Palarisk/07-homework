import * as d3 from 'd3'

// Set up margin/height/width

var margin = { top: 40, left: 40, right: 105, bottom: 40 }

var height = 700 - margin.top - margin.bottom

var width = 550 - margin.left - margin.right

// Add your svg

var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create a time parser (see hints)

let parseTime = d3.timeParse('%B-%y')

// Create your scales

let xPositionScale = d3.scaleLinear().range([0, width])

let yPositionScale = d3
  .scaleLinear()
  // .domain([100, 355])
  .range([height, 0])

let colorScale = d3
  .scaleOrdinal()
  .range([
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a'
  ])

// Create a d3.line function that uses your scales

var line = d3
  .line()
  // TULEEKS d.datetime vai d.month???
  .x(d => xPositionScale(d.datetime))
  .y(d => yPositionScale(d.price))

// Read in your housing price data

d3.csv(require('./housing-prices.csv'))
  .then(ready)
  .catch(err => {
    //  console.log("The error is", err)
  })

// Write your ready function

function ready(datapoints) {
  // console.log('Data is', datapoints)
  // Convert your months to dates

  datapoints.forEach(d => {
    d.datetime = parseTime(d.month)
  })

  // Get a list of dates and a list of prices

  let months = datapoints.map(d => +d.datetime)

  let prices = datapoints.map(d => +d.price)

  xPositionScale.domain(d3.extent(months))

  yPositionScale.domain(d3.extent(prices))

  // Group your data together

  var nested = d3
    .nest()
    .key(d => d.region)
    .entries(datapoints)

  //console.log(nested)

  // Draw your lines

  svg
    .selectAll('.price-line')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'price-line')
    .attr('class', function(d) {
      return d.key
    })
    .attr('d', d => {
      // d.key on esim NYC ja d.values on noi kaikki datapoints
      // console.log(d)
      return line(d.values)
    })
    .attr('stroke',  d => colorScale(d.key))
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .lower()

  // Adding my circles

  svg
    .selectAll('.last-circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', function(d) {
      return d.key
    })
    // .attr('class', 'last-circle')
    .attr('r', 3)
    .attr('cx', width)
    .attr('cy', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('fill',  d => colorScale(d.key))

  // Add your text on the right-hand side

  svg
    .selectAll('.region-label')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', function(d) {
      return d.key
    })
    // .attr('class', 'region-label')
    .text(function(d) {
      return d.key
    })
    .attr('x', width)
    .attr('y', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('font-size', 12)
    .attr('dx', 5)
    .attr('dy', function(d) {
    
      if (d.key === 'West North Central') {
        return 6
      }
      return 3
    })

  /*
    // console.log(months)
    // .attr('x', 100)
    // xPositionScale(months[months.length - 1]))
    */
  /*
    .attr('y', 1)

    .attr('x', function(d) {
      console.log(d.values)
      var lastDate = d.values.find(function(d) {
        return d.datetime == 1
      })
      return xPositionScale(lastDate.month)
    })
*/
  // Add your title

  svg
    .append('text')
    .text('U.S. housing prices fall in winter')
    .attr('x', width / 2)
    .attr('y', -20)
    .attr('text-anchor', 'middle')
    .attr('font-size', 22)


  // Add the shaded rectangle

  svg
    .selectAll('.greybox')
    .data(nested)
    .enter()
    .append('rect')
    .attr('width', function (d) {
      return xPositionScale(d.values[5].datetime) - xPositionScale(d.values[7].datetime)
    })
    .attr('height', height)
    .attr('y', 0)
    //.attr('x', 100)
    .attr('x', function (d) {
      return xPositionScale(d.values[7].datetime)
    })
    .attr('fill', '#F2F3F4')
    .lower()

  // Add your axes
  var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat('%b-%y'))

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  var yAxis = d3.axisLeft(yPositionScale)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  //  svg.select('.axis').lower()
  //  svg.selectAll('.domain').remove()
}
