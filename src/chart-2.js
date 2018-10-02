import * as d3 from 'd3'

// Set up margin/height/width

var margin = { top: 100, left: 30, right: 30, bottom: 30 }

var height = 250 - margin.top - margin.bottom

var width = 150 - margin.left - margin.right

// I'll give you the container
var container = d3.select('#chart-2')

// Create your scales

var xPositionScale = d3
  .scaleLinear()
  .domain([10, 60])
  .range([0, width])
var yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

// Create a d3.line function that uses your scales

var line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y(function(d) {
    return yPositionScale(d.ASFR_us)
  })

var areaUs = d3
  .area()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y0([height])
  .y1(function(d) {
    return yPositionScale(d.ASFR_us)
  })

var areaJp = d3
  .area()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y0([height])
  .y1(function(d) {
    return yPositionScale(d.ASFR_jp)
  })

// Read in your data

d3.csv(require('./fertility.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Build your ready function that draws lines, axes, etc

function ready(datapoints) {
  var nested = d3
    .nest()
    .key(function(d) {
      return d.Year
    })
    .entries(datapoints)
//  console.log(nested)

  container
    .selectAll('.fert-graph')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'fert-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      // which svg are we looking at?
      var svg = d3.select(this)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', areaUs)
        .attr('stroke', 'lightblue')
        .attr('fill', 'lightblue')
        .style('opacity', 0.5)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', areaJp)
        .attr('stroke', 'tomato')
        .attr('fill', 'tomato')
        .style('opacity', 0.5)

      var sumUs = d3
        .sum(d.values, function(d) {
          return +d.ASFR_us
        })
        .toFixed(2)
     // console.log(sumUs)

      svg
        .append('text')
        .text(sumUs)
        .attr('font-size', 10)
        .attr('fill', 'lightblue')
        .attr('x', 60)
        .attr('y', 20)


      var sumJp = d3
        .sum(d.values, function(d) {
          return +d.ASFR_jp
        })
        .toFixed(2)
      
      svg
        .append('text')
        .text(sumJp)
        .attr('font-size', 10)
        .attr('fill', 'tomato')
        .attr('x', 60)
        .attr('y', 30)

      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('font-size', 12)
        .attr('dy', -10)
        .attr('text-anchor', 'middle')

      var xAxis = d3.axisBottom(xPositionScale).tickValues([15, 30, 45])

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      var yAxis = d3.axisLeft(yPositionScale).ticks(4)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
    })
}
