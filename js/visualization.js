d3.json('./../js/data.json', function(data) {
    var results = data['results']['bindings'];
    var processInputMapping = {};
    var processOutputMapping = {};
    var processNodeIndices = {};
    var putNodeIndices = {};
    
    var addInputProcess = function(processName, inputName) {
        processInputMapping[processName] = processInputMapping[processName] || [];
        processInputMapping[processName].push(inputName);
    }
    
    var addOutputProcess = function(processName, outputName) {
        processOutputMapping[processName] = processOutputMapping[processName] || [];
        processOutputMapping[processName].push(outputName);
    }
    
    /*
        @params: string URI
        @return: a parsed, human-readable substring of the URI
    */
    var stripNameFromURI = function(uri) {
        return uri.substring(uri.lastIndexOf('CE_')+3, uri.length).toLowerCase();
    }
    
    var mapNodesEdges = function(graph) {
        var j = 0;
        for (var i = 0; i < results.length; i++) {
            //get URI of step from JSON
            var step = results[i].hasOwnProperty('step') ? results[i]['step']['value'] : null;
            
            //add step to processNodeIndices if the step hasn't been added yet
            if (processNodeIndices[step] == null) {
                processNodeIndices[step] = j;
                //get readable display for step name
                var stepToDisplay = stripNameFromURI(step);
                stepToDisplay = stepToDisplay.substring(0, stepToDisplay.lastIndexOf('node')) == '' ? stepToDisplay : stepToDisplay.substring(0, stepToDisplay.lastIndexOf('node'));
                vis.setNode(j, { 
                    label: stepToDisplay,
                    style: "fill: #FFCC99;",
                    uri: step
                });
                j++;
            }
            if (results[i].hasOwnProperty('input')) {
                //get URI of input from JSON
                var input = results[i]['input']['value'];
                if (putNodeIndices[input] == null) {
                    putNodeIndices[input] = j;
                    //get readable display for input name
                    var inputToDisplay = stripNameFromURI(input);
                    vis.setNode(j, { 
                        label: inputToDisplay,
                        shape: 'ellipse',
                        style: "fill: #003366;",
                        uri: input
                    });
                    j++;
                }
                addInputProcess(step, input);
            } else if (results[i].hasOwnProperty('output')) {
                //get URI of output from JSON
                var output = results[i]['output']['value'];
                if (putNodeIndices[output] == null) {
                    putNodeIndices[output] = j;
                    //get readable display for output name
                    var outputToDisplay = stripNameFromURI(output);
                    vis.setNode(j, { 
                        label: outputToDisplay,
                        shape: 'ellipse',
                        style: "fill: #003366;",
                        uri: output
                    });
                    j++;
                }
                addOutputProcess(step, output);
            }
        }
    }
    
    var vis = new dagreD3.graphlib.Graph()
        .setGraph({})
        .setDefaultEdgeLabel(function() { return {} });
    
    mapNodesEdges(vis);
    
    for (var process in processInputMapping) {
        for (var i = 0; i < processInputMapping[process].length; i++) {
            vis.setEdge(putNodeIndices[processInputMapping[process][i]], processNodeIndices[process], {
                style: "stroke: #000; fill:none"
            });
        }
    }
    
    for (var process in processOutputMapping) {
        for (var i = 0; i < processOutputMapping[process].length; i++) {
            vis.setEdge(processNodeIndices[process], putNodeIndices[processOutputMapping[process][i]], {
                style: "stroke: #000; fill:none"
            });
        }
    }
    
    // Create the renderer
    var render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("svg").attr('width','100%').attr('height','100%'), svgGroup = svg.append("g");

    // Run the renderer. This is what draws the final graph.
    render(svgGroup, vis);
    
    //centers graph and calculates top margin of graph based on screen size
    var xCenterOffset = (screen.width - vis.graph().width) / 2;
    var yTopMargin = screen.height * .05;
    svgGroup.attr("transform", "translate(" + xCenterOffset + ", " + yTopMargin + ")");
    svg.attr("height", vis.graph().height + yTopMargin + 40);
    
    d3.select('svg g g g.nodes').attr('fill', '#FFF');
    
    //setup on click listeners for every node
    svg.selectAll("g.node").on("click", function(id) {
        //call function from processInfoScript.js to add 1 table to roulette
        addProcessInfo();
        //TODO: connect to Tiff's roulette logic and populate her roulette info
    });
});