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

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal().domain(["Alabama", "Alaska", "American Samoa", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia", "Guam", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Minor Outlying Islands", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Northern Mariana Islands", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Puerto Rico", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "U.S. Virgin Islands", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"])
    .range(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494"]);

  var radiusScale = d3.scaleSqrt().domain([1, 359235]).range([10, 85])

  // the simulation is a collection of forces
  // about how and where we want the bubbles
  var simulation = d3.forceSimulation()
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY((height / 2) - 150).strength(0.05))
    .force("collide", d3.forceCollide(function(d) {
      return radiusScale(d.cases) + 3;
    }))

  var drag = d3.drag()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded);

  d3.queue()
    .defer(d3.csv, "05-20-2020.csv")
    .await(ready)

  function ready(error, datapoints) {
    var circles = svg.selectAll(".state")
      .data(datapoints)
      .enter().append("circle")
      .call(drag)
      .attr("class", "state")
      .attr("r", function(d) {
        return radiusScale(d.cases)
      })
      .style("fill", function(d) {
        return myColor(d.state);
      })

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

  function dragStarted(d) {
    simulation.alphaTarget(0.3).restart();
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragged(d) {
    simulation.alphaTarget(0.5);
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragEnded(d) {
    simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

})();
