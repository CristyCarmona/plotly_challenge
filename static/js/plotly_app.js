// Global Variables 
var demoInfo = [];
var samplesInfo = [];

// Get source data from json file using d3 
d3.json("data/data_samples.json").then((data) => {
    
    // Get Subjects ID 
    var subject_ids = data.names;

    // Append values for "Test Subject ID No." dropdown
    d3.select("#selDataset").selectAll("option")
    .data(subject_ids)
    .enter() // creates placeholder for new data
    .append("option") // appends an "option" placeholder
    .text(function(d) { 
        return d;
    }); // insert the value from subject_ids array  

      
    // Get metadata values to display Demographic Info 
    demoInfo = data.metadata;

    samplesInfo = data.samples

});

// OnChange function (trigger by id="selDataset" DOM element)
function optionChanged(value) {
    var idValue = value;
      
    // Bar and bubble graph code  
    samplesInfo.forEach((sample) => {
        
        // Get the sample info for the selected subject 
        if (sample.id == idValue) {
            
            // Variables 
            var otuIds = sample.otu_ids
            var otuIdLabels = []
            var otuLabels = sample.otu_labels
            var sampleValues = sample.sample_values
            
            //Bar graph
            // Add "OTU" string to the OtuIds 
            otuIds.forEach((otu)=>{
                otuIdLabels.push("OTU "+otu)
            });
            
            //Display Bar Graph. If array length is 10 or less display all info. Else, slice the array and get only the first 10 values.  
            if (sampleValues.length <= 10) {
                
                var trace1 = {
                    x: sampleValues.reverse(),
                    y: otuIdLabels.reverse(),
                    orientation: 'h',
                    text: otuLabels.reverse(),
                    type: 'bar'
                };

                var data = [trace1];

                var layout = {
                    title: 'Test Subject OTUs'
                };

                Plotly.newPlot("bar", data, layout);
            } else {
                console.log("es MAYOR de 10 datos")
                var trace1 = {
                    x: sampleValues.slice(0,10).reverse(),
                    y: otuIdLabels.slice(0,10).reverse(),
                    orientation: 'h',
                    text: otuLabels.slice(0,10).reverse(),
                    type: 'bar'
                };

                var data = [trace1];

                var layout = {
                    title: '<b>Test Subject OTUs</b>'
                };

                Plotly.newPlot("bar", data, layout);
            }
                        
            // Bubble chart 
            var trace2 = [{
                x: otuIds,
                y: sampleValues,
                mode: 'markers',
                marker: {
                    size: sampleValues,
                    color: otuIds,
                    colorscale: "Earth"
                  },
                text: otuLabels,
            }];

            var bubblelayout = {
                title: "<b>Bacteria Cultures Per Sample</b>",
                margin: { t: 0 },
                hovermode: "closest",
                xaxis: { title: "OTU ID" },
                margin: { t: 30}
            }; 

            Plotly.newPlot("bubble", trace2, bubblelayout);
        };
    });

    // Demographic Info Code 
    demoInfo.forEach((metadata) => {
        // Get the demographic info for the selected subject 
        if (metadata.id == idValue) {
                       
            var demoInfoDisplay = [];
            for (const [k, v] of Object.entries(metadata)){
                demoInfoDisplay.push(k + ": " + v);
            }
            
            // Display Demo info in id = "metadata_list" DOM element 
            d3.select("#metadata_list").selectAll("li")
                .data(demoInfoDisplay)
                .text(function(d) {
                    return d;
                });
            
            //Gauge Chart

            //Get the scrub frequency for the selected subject 
            var scrubFreq = metadata.wfreq

            //  Trig to calc meter point
            var degrees = 180 - ((scrubFreq*20)-10), radius = .5;
            var radians = degrees * Math.PI / 180;
            var aX = 0.025 * Math.cos((degrees-90) * Math.PI / 180);
            var aY = 0.025 * Math.sin((degrees-90) * Math.PI / 180);
            var bX = -0.025 * Math.cos((degrees-90) * Math.PI / 180);
            var bY = -0.025 * Math.sin((degrees-90) * Math.PI / 180);
            var cX = radius * Math.cos(radians);
            var cY = radius * Math.sin(radians);

            var path = 'M ' + aX + ' ' + aY +
                     ' L ' + bX + ' ' + bY +
                    ' L ' + cX + ' ' + cY +
                    ' Z';
            
            // Gauge trace to display  
            var trace3 = [{ type: 'scatter',
                x: [0], y:[0],
                marker: {size: 14, color:'850000'},
                showlegend: false,
                name: 'Scrubs/week',
                text: scrubFreq,
                hoverinfo: 'text+name'},
                {
                values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
                rotation: 90,
                text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
                textinfo: "text",
                textposition: "inside",
                marker: {
                  colors: ["rgba(128, 181, 134, .7)", "rgba(133, 188, 139, .7)", "rgba(135, 192, 128, .7)",
                    "rgba(183, 205, 139, .7)", "rgba(213, 229, 149, .7)", "rgba(229, 233, 177, .7)",
                    "rgba(233, 231, 201, .7)", "rgba(243, 240, 229, .7)", "rgba(247, 242, 236, .7)",
                    "rgba(255, 255, 255, 0)"]},
                labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
                hoverinfo: "label",
                hole: .5,
                type: "pie",
                showlegend: false
              }];
            //Gauge graph layout 
            var gaugeLayout = {
                shapes:[{
                    type: 'path',
                    path: path,
                    fillcolor: '850000',
                    line: {
                      color: '850000'
                    }
                  }],
                height: 400,
                width: 400,
                title: "<b>Belly Button Washing Frequency</b> <br> Srubs per week",
                xaxis: {zeroline:false, showticklabels:false,
                           showgrid: false, range: [-1, 1]},
                yaxis: {zeroline:false, showticklabels:false,
                           showgrid: false, range: [-1, 1]}
            };
            // Display gauge graph
            Plotly.newPlot("gauge", trace3, gaugeLayout);
        };
    });
};

