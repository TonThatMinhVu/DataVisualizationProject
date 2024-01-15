const width = 1200;
const height = 1280;
const padding = 100;

var rowConverter = function (d) {
  return {
    area: d["Countries and areas"],
    PrimaryMale: parseFloat(d["OOSR_Primary_Age_Male"]),
    PrimaryFemale: parseFloat(d["OOSR_Primary_Age_Female"]),
    // UpperSecondaryMale: parseFloat(d["OOSR_Upper_Secondary_Age_Male"]),
    // UpperSecondaryFemale: parseFloat(d["OOSR_Upper_Secondary_Age_Female"]),
    // RatePrimaryMale: parseFloat(d["Completion_Rate_Primary_Male"]),
    // RatePrimaryFemale: parseFloat(d["Completion_Rate_Primary_Female"]),
    // RateUpperSecondaryMale: parseFloat(d["Completion_Rate_Upper_Secondary_Male"]),
    // RateUpperSecondaryFemale: parseFloat(d["Completion_Rate_Upper_Secondary_Female"])
  };
};

function Barchart() {
  d3.csv("https://gist.githubusercontent.com/Tuanne2108/f3e20d4752299d6f408e199bea274ddb/raw/467c03104263e20c0d9a0ca3565b86844aee58c7/education", rowConverter)
    .then((data) => {
      console.log(data);

      // Filter the first 20 items in the data
      var currentData = data.filter(d => d.PrimaryMale > 12 && d.PrimaryFemale > 12)
      // Add svg element
      var svg1 = d3
        .select(".Barchart")
        .append("svg")
        .attr("height", height)
        .attr("width", width);

      var xScale = d3
        .scaleLinear()
        .domain([0, d3.max(currentData, (d) => d.PrimaryMale)])
        .range([padding, width - padding]);

      var yScale = d3
        .scaleBand()
        .domain(currentData.map((d) => d.area))
        .range([padding, height - padding])
        .paddingInner(0.2);

      // svg1
      //   .selectAll("rect")
      //   .data(currentData)
      //   .enter()
      //   .append("rect")
      //   .attr("x", padding*2)
      //   .attr("y", (d) => yScale(d.area))
      //   .attr("width", (d) => xScale(d.PrimaryMale) - padding )
      //   .attr("height", yScale.bandwidth())
      //   .attr("fill", (d) => "rgb(123, " + d.PrimaryMale + ",1)");

        var subgroupScale = d3.scaleBand()
        .domain(['PrimaryMale', 'PrimaryFemale'])
        .range([0, yScale.bandwidth()])
        .padding([0.05]);

  svg1.selectAll(".bar-primary-male")
  .data(currentData)
  .enter().append("rect")
  .attr("class", "bar-primary-male")
  .attr("x", d => padding *2  )
  .attr("y", d => padding /20  + subgroupScale('PrimaryMale')+ yScale(d.area))
  .attr("width", d => height - padding - xScale(d.PrimaryMale))
  .attr("height", subgroupScale.bandwidth())
  .attr("fill", "green");

  svg1.selectAll(".bar-primary-female")
  .data(currentData)
  .enter().append("rect")
  .attr("class", "bar-primary-female")
  .attr("x", d => padding *2  )
  .attr("y", d => padding /20 + subgroupScale('PrimaryFemale')+ yScale(d.area))
  .attr("width", d => height - padding - xScale(d.PrimaryFemale))
  .attr("height", subgroupScale.bandwidth())
  .attr("fill", "black");

      // svg1
      //   .selectAll("text.PrimaryMale")
      //   .data(currentData)
      //   .enter()
      //   .append("text")
      //   .text(function (d) {
      //     return d.PrimaryMale;
      //   })
      //   .attr("class", "PrimaryMale")
      //   .attr("text-anchor", "middle") // Adjusted for better alignment
      //   .attr("x", function (d) {
      //     return xScale(d.PrimaryMale) + padding  ; // Adjust as needed for better positioning
      //   })
      //   .attr("y", function (d) {
      //     return yScale(d.area) + yScale.bandwidth(); // Centered vertically in the bar
      //   })
      //   .attr("font-size", "12px")
      //   .attr("fill", "red");

    // Add x-axis
    var xAxis = d3.axisBottom().scale(xScale);
    svg1
      .append("g")
      .attr("class", "xAxis")
      .attr(
        "transform",
        "translate(" + padding + "," + (height - padding) + ")"
      )
      .call(xAxis);
    svg1
      .append("text")
      .text("%")
      .attr("class", "xAxis-label")
      .attr("text-anchor", "middle")
      .attr("x", width /1.01)
      .attr("y", height - padding *0.8)
      .attr("font-size", 20);

    // Add Countries and areas label
    svg1.selectAll("text.area")
    .data(currentData)
    .enter()
    .append("text")
    .text(function (d) {
      return d.area;
    })
    .attr("class", "area")
    .attr("text-anchor", "end")
    .attr("x", padding *1.6)
    .attr("y", function (d) {
      return yScale(d.area) + yScale.bandwidth() / 2 + 4; // Adjust for vertical centering
    })
    .attr("font-size", "20px")
    .attr("fill", "black");
    })
}