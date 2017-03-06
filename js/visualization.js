var processInputMapping = {};
var processOutputMapping = {};
getGraphJSON(localStorage.getItem("workflow-uri"), function(res) {
    var results = res['results']['bindings'];
    var processNodeIndices = {};
    var putNodeIndices = {};

    /*
        @params: string processName, string inputName
        - inserts the inputName to the list of inputs that the processName maps
        to within the object processInputMapping
    */
    var addInputProcess = function(processName, inputName) {
        processInputMapping[processName] = processInputMapping[processName] || [];
        processInputMapping[processName].push(inputName);
    }

    /*
        @params: string processName, string outputName
        - inserts the outputName to the list of outputs that the processName maps
        to within the object processOutputMapping
    */
    var addOutputProcess = function(processName, outputName) {
        processOutputMapping[processName] = processOutputMapping[processName] || [];
        processOutputMapping[processName].push(outputName);
    }

    /*
        @params: dagreD3 graph
        - pulls from JSON result and sets nodes according to whether or not they are labeled as inputs, outputs, or processes
    */
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
                    labelStyle: "fill: #000",
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
                        labelStyle: "fill: #FFF",
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
                        labelStyle: "fill: #FFF",
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

    /*
        params: dagreD3 vis
        - connects nodes to each other via node numbers from processInputMapping
        and processOutputMapping
    */
    var setGraphEdges = function (vis) {
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
    }


    /*
        renders graph
    */
    var vis = new dagreD3.graphlib.Graph()
        .setGraph({
            nodesep: 10,
            ranksep: 20,
        })
        .setDefaultEdgeLabel(function() { 
            return {} 
        });

    mapNodesEdges(vis);
    setGraphEdges(vis);

    // Create the renderer
    var render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("svg").attr('width','50%').attr('height','100%'), svgGroup = svg.append("g");

    // Set up zoom support
    var zoom = d3.behavior.zoom().on("zoom", function() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")" +
                                    "scale(" + d3.event.scale + ")");
    });
    svg.call(zoom);

    // Run the renderer. This is what draws the final graph.
    render(svgGroup, vis);

    //centers graph and calculates top margin of graph based on screen size
    var xCenterOffset = (document.getElementsByClassName('visualization-container')[0].clientWidth / 2 - vis.graph().width) / 2;
    var yTopMargin = screen.height * .05;
    var scale = 1;
    zoom
      .translate([xCenterOffset, 20])
      .scale(scale)
      .event(svg);
    svg.attr('height', vis.graph().height * scale + yTopMargin);

    setupNodeOnClick(svg, vis);
    addHover(svg);
});

/*
    @params: d3 svg
    - setup on click process for each node
*/
var setupNodeOnClick = function (svg, vis) {
    //setup on click listeners for every node
    svg.selectAll("g.node").on("click", function(id) {
        addProcessInfo(vis.node(id).uri, processInputMapping[vis.node(id).uri], processOutputMapping[vis.node(id).uri]);
    });
}

/*
    @params: d3 svg
    - add hover opacity effect for each node when it is moused over, and returns back to normal opacity when it is moused out
*/
var addHover = function(svg) {
    //change opacity of nodes based on whether or not the mouse is hovering over them
    svg.selectAll('g.node').on('mouseover', function(id) {
        svg.selectAll('g.node').style('opacity', function(id1){
            if (id == id1) return 0.7;
        });
    });
    
    svg.selectAll('g.node').on('mouseout', function(id) {
        svg.selectAll('g.node').style('opacity', function(id1){
            return 1;
        });
    });
}

/*
    @params: string URI
    @return: a parsed, human-readable substring of the URI
*/
var stripNameFromURI = function(uri) {
    return uri.substring(uri.lastIndexOf('CE_')+3, uri.length).toLowerCase();
}