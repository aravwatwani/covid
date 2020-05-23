(function() {
  var width = screen.width,
    height = screen.height;

  var headText = d3.select("div")
    .append("h1")
    .attr("class", "heading")
    .text("A COVID-19 Data Visualization")
    .append("h5")
    .attr("class", "heading")
    .text("Made by Arav Watwani")

  var svg = d3.select("#chart")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .append("g")
    .attr("transform", "translate(0, 0)")



  var radiusScale = d3.scaleSqrt().domain([1, 359235]).range([10, 70])

  // the simulation is a collection of forces
  // about how and where we want the bubbles
  var simulation = d3.forceSimulation()
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY((height / 2) - 200).strength(0.05))
    .force("collide", d3.forceCollide(function(d) {
      return radiusScale(d.cases) + 1;
    }))

  d3.queue()
    .defer(d3.csv, "05-20-2020.csv")
    .await(ready)

  function ready(error, datapoints) {
    var circles = svg.selectAll(".state")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "state")
      .attr("r", function(d) {
        return radiusScale(d.cases)
      })
      .attr("fill", "orange")

    simulation.nodes(datapoints)
      .on("tick", ticked)

    function ticked() {
      circles
        .attr("cx", function(d) {
          return d.x
        })
        .attr("cy", function(d) {
          return d.y
        })
    }
  }

})();
