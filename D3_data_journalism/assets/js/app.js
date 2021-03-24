var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("./assets/data/data.csv").then(function(censusData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function(data) {
        data.poverty = parseFloat(data.poverty);
        data.age = parseFloat(data.age);
        data.income = parseFloat(data.income);
        data.healthcare = parseFloat(data.healthcare);
        data.obesity = parseFloat(data.obesity);
        data.smokes = parseFloat(data.smokes);
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.poverty) * 0.9, d3.max(censusData, d => d.poverty) *1.1])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d.healthcare) *1.1])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    var textGroup = chartGroup.selectAll(".stateText")
        .data(censusData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("dy", "0.3em")
        .text(d => d.abbr)
        .attr("color", "white");

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .attr("opacity", "1")
      .attr("background", "blue")
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Lacks Healthcare ${d.healthcare}%`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    textGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2.2}, ${height + margin.top + 20})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });




// // @TODO: YOUR CODE HERE!


// var svgWidth = 960;
// var svgHeight  = 500;

// var margin = {
//     top: 20,
//     right: 40,
//     bottom: 80,
//     left: 100
// };

// var width = svgWidth - margin.left - margin.right;
// var height = svgHeight - margin.top - margin.bottom;

// var svg = d3.select("#scatter")
//     .append("svg")
//     .attr("width", svgWidth)
//     .attr("height", svgHeight);

// var chartGroup = svg.append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

// var chosenXAxis = "poverty";
// var chosenYAxis = "healthcare";

// function xScale(censusData, chosenXAxis) {
    
//     var xLinearScale = d3.scaleLinear()
//         .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
//             d3.max(censusData, d => d[chosenXAxis]) * 1.2
//         ])
//         .range([0, width]);
    
//     return xLinearScale;

// }

// function yScale(censusData, chosenYAxis) {

//     var yLinearScale = d3.scaleLinear()
//         .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
//             d3.max(censusData, d => d[chosenYAxis]) * 1.2
//         ])
//         .range([height, 0]);

//     return yLinearScale;

// }

// function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    
//     circlesGroup.transition()
//         .duration(1000)
//         .attr("cx", d => newXScale(d[chosenXAxis]))
//         .attr("cy", d => newYScale(d[chosenYAxis]));
    
//     return circlesGroup;
// }

// function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

//     var xLabel;
//     var yLabel;

//     if (chosenXAxis === "poverty") {
//         xLabel = "In Poverty (%):";
//     } else if (chosenXAxis === "age") {
//         xLabel = "Median Age (years):";
//     } else {
//         xlabel = "Median Household Income ($):"
//     }

//     if (chosenYAxis === "healthcare") {
//         yLabel = "Lacks Healthcare (%):";
//     } else if (chosenYAxis === "smokes") {
//         yLabel = "Smokes (%):"
//     } else {
//         ylabel = "Obese (%):"
//     }

//     var toolTip = d3.tip()
//         .attr("class", "tooltip")
//         .offset([80, -60])
//         .html(function(d) {
//             return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
//         });
    
//     circlesGroup.call(toolTip);

//     circlesGroup.on("mouseover", function(data) {
//         toolTip.show(data);
//     })
//       .on("mouseout", function(data, index) {
//           toolTip.hide(data);
//       });
    
//     return circlesGroup;
// }

// d3.csv("./assets/data/data.csv").then(function(censusData, err) {
//     if (err) throw err;

//     censusData.forEach(function(data) {
//         data.poverty = parseFloat(data.poverty);
//         data.age = parseFloat(data.age);
//         data.income = parseFloat(data.income);
//         data.healthcare = parseFloat(data.healthcare);
//         data.obesity = parseFloat(data.obesity);
//         data.smokes = parseFloat(data.smokes);
//     });

//     var xLinearScale = xScale(censusData, chosenXAxis);

//     var yLinearScale = yScale(censusData, chosenYAxis);

//     var bottomAxis = d3.axisBottom(xLinearScale);
//     var leftAxis = d3.axisLeft(yLinearScale);

//     var xAxis = chartGroup.append("g")
//         .classed("x-axis", true)
//         .attr("transform", `translate(0, ${height})`)
//         .call(bottomAxis);
    
//     chartGroup.append("g")
//         .call(leftAxis);

//     var circlesGroup = chartGroup.selectAll("circle")
//         .data(censusData)
//         .enter()
//         .append("circle")
//         .attr("cx", d => xLinearScale(d[chosenXAxis]))
//         .attr("cy", d => yLinearScale(d[chosenYAxis]))
//         .attr("r", 10)
//         .attr("fill", "blue")
//         .attr("opacity", ".5");
    
//     var xLabelsGroup = chartGroup.append("g")
//         .attr("transform", `translate(${width / 2}, ${height + 20})`);

//     var yLabelGroup = chartGroup.append("g")
//         .attr("transform", `translate(${width + 20}, ${height / 2})`);

//     var povertyLabel = xLabelsGroup.append("xtext")
//         .attr("x", 0)
//         .attr("y", 20)
//         .attr("value", "poverty")
//         .classed("active", true)
//         .text("In Poverty (%)");

//     var ageLabel = xLabelsGroup.append("xtext")
//         .attr("x", 0)
//         .attr("y", 40)
//         .attr("value", "age")
//         .classed("inactive", true)
//         .text("Age (Median)");

//     var incomeLabel = xLabelsGroup.append("xtext")
//         .attr("x", 0)
//         .attr("y", 60)
//         .attr("value", "income")
//         .classed("inactive", true)
//         .text("Household Income (Median)");
    
//     var healthcareLabel = yLabelGroup.append("ytext")
//         .attr("transform", "rotate(-90)")
//         .attr("x", 20)
//         .attr("y", 0)
//         .attr("value", "healthcare")
//         .classed("active", true)
//         .text("Lacks Healthcare (%)");

//     var smokesLabel = yLabelGroup.append("ytext")
//         .attr("transform", "rotate(-90)")
//         .attr("x", 40)
//         .attr("y", 0)
//         .attr("value", "smokes")
//         .classed("inactive", true)
//         .text("Smokes (%)");

//     var obeseLabel = yLabelGroup.append("ytext")
//         .attr("transform", "rotate(-90)")
//         .attr("x", 60)
//         .attr("y", 0)
//         .attr("value", "obesity")
//         .classed("inactive", true)
//         .text("Obese (%)");

//     var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

//     xLabelsGroup.selectAll("xtext")
//         .on("click", function() {
//             var value = d3.select(this).attr("value");
            
//             if (value !== chosenXAxis) {
//                 chosenXAxis = value;
//                 xLinearScale = xScale(censusData, chosenXAxis);
//                 xAxis = renderAxes(xLinearScale, xAxis);
//                 circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
//                 circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//                 if (chosenXAxis === "poverty") {
//                     povertyLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     ageLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     incomeLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                 } else if (chosenXAxis === "age") {
//                     povertyLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     ageLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     incomeLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                 } else {
//                     povertyLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     ageLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     incomeLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                 }
//             }
//         });
    
//     yLabelsGroup.selectAll("ytext")
//         .on("click", function() {
//             var value = d3.select(this).attr("value");
            
//             if (value !== chosenYAxis) {
//                 chosenYAxis = value;
//                 yLinearScale = yScale(censusData, chosenYAxis);
//                 yAxis = renderAxes(yLinearScale, yAxis);
//                 circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);
//                 circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

//                 if (chosenYAxis === "healthcare") {
//                     healthcareLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     smokesLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     obeseLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                 } else if (chosenYAxis === "smokes") {
//                     healthcareLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     smokesLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     obeseLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                 } else {
//                     healthcareLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     smokesLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     obeseLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                 }
//             }
//         });
// }).catch(function(error) {
//     console.log(error);
// });