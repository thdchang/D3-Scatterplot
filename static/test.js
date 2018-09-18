// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);

// When the browser loads, makeResponsive() is called.
makeResponsive();



// The code for the chart is wrapped inside a function
// that automatically resizes the chart
function makeResponsive() {


    var svgArea = d3.select("body").select("svg");
    if (!svgArea.empty()) {
      svgArea.remove();
    }
    var svgWidth = window.innerWidth * 0.70;
    var svgHeight = window.innerHeight * 0.80;

    var chartMargin = {
        top: 100,
        bottom: 100,
        left: 100,
        right: 100
    }

    // chart area minus margins
    var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
    var chartWidth = svgWidth - chartMargin.left - chartMargin.right;


    var svg = d3.select("#svg-chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);





    // var chartGroup = svg.append("g").attr("transform", "translate(30,30)");
    var chartGroup = svg.append("g").attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);






    d3.csv("data.csv", function(error, data) {
        if (error) return console.warn(error)

        data.forEach(function(data) {
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.income = +data.income;
            data.healthcare = +data.healthcare;
            data.obseity = +data.obseity;
            data.smokes = +data.smokes;

        })     


        var xData = data.map( x => x.poverty)
        var yData = data.map( x => x.healthcare)
        

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(yData)])
            .range([chartHeight, 0]);




        var xScale = d3.scaleLinear()
            .domain([0, d3.max(xData)])
            .range([d3.min(xData), chartWidth])


        //create axes
        var yAxis = d3.axisLeft(yScale);
        var xAxis = d3.axisBottom(xScale);


        chartGroup.append("g")
            .call(yAxis);

        // text label for the y axis
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - (chartMargin.left/1.5))
            .attr("x", 0 - (chartHeight / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Lacks Healthcare (%)");          



        // move xAxis to the bottom of the chart
        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis);

        chartGroup.append("text")             
            .attr("transform",
                    "translate(" + (chartWidth/2) + " ," + 
                                    (chartHeight + chartMargin.top-25) + ")")
            .style("text-anchor", "middle")
            .text("Poverty (%)");
        


        // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([-10, 0])
        .html(function(data) {
            return (`<p style="color:red!important">${data.state}</p><p>Poverty:<span style="color:yellow">&nbsp;&nbsp;${data.poverty}%</span></p>Healthcare:<span style="color:yellow">&nbsp;&nbsp;${data.healthcare}%</span></p>`);
        });

        var groups = chartGroup.selectAll("g .markers")
            .data(data)
            .enter()
            .append("g")
            .classed("markers",true)
            .attr("id", function(data){return data.id})
            .attr("transform", function(data) {
                return `translate(${xScale(data.poverty)}, ${yScale(data.healthcare)})`;
            });
        
        var markerText = groups.append("text").text(function(data) {return data.abbr}).attr("class", "abbr").attr("text-anchor","middle").attr("alignment-baseline","central");
        // var markerText = groups.append("text").text(function(data) {return data.abbr}).attr("class", "abbr");

        
        var circles = groups.append("circle")
            .attr("class", "points")
            .attr("r", "15")
            .attr("cy", 0)
            .attr("cx", 0)
            // .attr("cy", function(data) {return yScale(data.healthcare)})
            // .attr("cx", function(data) {return xScale(data.poverty)})
            .attr("fill", "gold")
            .attr("stroke", "black")
            .attr("stroke-width",0.5)
            .attr("opacity", 0.5);
        

        groups.on("mouseover", toolTip.show).on("mouseout", toolTip.hide);


    // var circleGroup = groups.selectAll("circle")
        // .data(data)
        // .enter()
        // .append("circle")
        // .attr("class", "points")
        // .attr("r", "15")
        // .attr("cy", function(data) {return yScale(data.healthcare)})
        // .attr("cx", function(data) {return xScale(data.poverty)})
        // .attr("fill", "rgb(17, 224, 252)")
        // .attr("stroke", "black")
        // .attr("stroke-width",0.5)
        // .on("mouseover", toolTip.show)
        // .on("mouseout", toolTip.hide);

        circles.call(toolTip);


    });    


};


