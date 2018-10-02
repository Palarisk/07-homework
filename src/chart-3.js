import * as d3 from 'd3'

// Create your margins and height/width
var margin = { top: 100, left: 40, right: 30, bottom: 30 }

var height = 300 - margin.top - margin.bottom

var width = 200 - margin.left - margin.right

// I'll give you this part!
var container = d3.select('#chart-3')

// Create your scales

var xPositionScale = d3
  .scaleLinear()
  .domain([1980, 2010])
  .range([0, width])
var yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])

// Create your line generator

var line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.year)
  })
  .y(function(d) {
    return yPositionScale(d.income)
  })

// Read in your data

Promise.all([
  d3.csv(require('./middle-class-income.csv')),
  d3.csv(require('./middle-class-income-usa.csv'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Create your ready function

function ready([allcountries, usa]) {
  var nested = d3
    .nest()
    .key(function(d) {
      return d.country
    })
    .entries(allcountries)
  console.log(nested)
  //console.log(usa)




  container
    .selectAll('.income-graph')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'income-graph')
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
        .attr('d', line)
        .attr('stroke', '#9e4b6c')
        .attr('fill', 'none')

       svg
        .append('path')
        .datum(usa)
        .attr('d', line)
        .attr('stroke', 'grey')
        .attr('fill', 'none')


       svg
        .append('text')
        .text('USA')
        .attr('x', 15)
        .attr('y', 23)
        .attr('font-size', 9)
        .attr('stroke', 'grey')

      var xAxis = d3
        .axisBottom(xPositionScale)
        .ticks(4)
        .tickFormat(d3.format('d'))
        .tickSize(-height)

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      var yAxis = d3
        .axisLeft(yPositionScale)
        .tickValues([5000, 10000, 15000, 20000])
        .tickSize(-width)
        .tickFormat(d3.format("$,d"))


      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)

      svg
        .selectAll('.tick line')
        .attr('stroke-dasharray', '2 2')
        .attr('stroke', 'lightgrey')

      svg.selectAll('.domain').remove()

      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('font-size', 12)
        .attr('dy', -12)
        .attr('text-anchor', 'middle')
        .attr('fill', '#9e4b6c')
        .attr('font-weight', 'bold')
    })
}
