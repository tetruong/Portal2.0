var svg = {};
var vis = {};
var processInputMapping = {};
var processOutputMapping = {};
var workflowURI = localStorage.getItem("workflow-uri");
getGraphJSON(workflowURI, function(res) {
    renderVisualization(res, false);
});

var renderVisualization = function (res, isArtifact) {
    document.getElementById('workflow-name').innerHTML
        = localStorage.getItem('workflow-label');
    d3.select("svg").remove();
    d3.select('.visualization-container').append('svg');
    var results = res['results']['bindings'];
    var processNodeIndices = {};
    var putNodeIndices = {};
    processInputMapping = {};
    processOutputMapping = {};

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
                    shape: 'process',
                    label: stepToDisplay,
                    labelStyle: "fill: #000",
                    style: "fill: #FFCC99;",
                    uri: step,
                    type: 'process'
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
                        labelStyle: 'fill: #FFF',
                        shape: 'customEllipse',
                        style: 'fill: #003366;',
                        uri: input,
                        type: 'input'
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
                        shape: 'customEllipse',
                        style: "fill: #003366;",
                        uri: output,
                        type: 'output'
                    });
                    j++;
                }
                addOutputProcess(step, output);
            }
        }
        setGraphEdges(vis);
    }

    /*
        @params: dagreD3 vis
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
        if (!isArtifact)
            formatInputs(vis, renderGraph);
        else
            renderGraph(vis);
    }
    
    var renderGraph = function(vis) {
        // Create the renderer
        var render = new dagreD3.render();
        
        // Add dimensions to nodes if there are any
        addDimensions(render);
        // Set up an SVG group so that we can translate the final graph.
        svg = d3.select("svg").attr('width','50%').attr('height','100%'), svgGroup = svg.append("g");

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
        var scale = .75;
        zoom.translate([xCenterOffset, 20])
            .scale(scale)
            .event(svg);
        svg.attr('height', vis.graph().height * scale + yTopMargin);

        setupNodeOnClick(svg, vis);
    }
    
    /*
        
    */
    var formatInputs = function(vis, callback) {
        getInputs(workflowURI, function (inputs) {
            for (var i = 0; i < inputs.length; i++) {
                var nodeIndex = putNodeIndices[inputs[i].input.value];
                var newLabel = vis.node(nodeIndex).label;
                var newURI = vis.node(nodeIndex).uri;
                vis.setNode(nodeIndex, { 
                    label: newLabel,
                    labelStyle: "fill: #FFF",
                    shape: 'customInputEllipse',
                    style: "fill: #336633;",
                    uri: newLabel,
                    type: 'input'
                });
            }
            callback(vis);
        })
    }

    /*
        renders graph
    */
    vis = new dagreD3.graphlib.Graph()
        .setGraph({
            nodesep: 10,
            ranksep: 20,
        })
        .setDefaultEdgeLabel(function() { 
            return {} 
        });

    mapNodesEdges(vis);
}

var highlightHandler = function (checkbox) {
    console.log(checkbox.checked);
    highlightInputs(checkbox.checked);
}

var highlightInputs = function(checked) {
    if (checked) {
    } else {
        // make an array of objects- the objects contain a process URI
        
        // how can I know which checkbox is checked to highlight inputs?
    }
}

/*
    @params: d3 svg
    - setup on click process for each node
*/
var setupNodeOnClick = function (svg, vis) {
    //setup on click listeners for every node
    svg.selectAll("g.node").on('click', function(id) {
        var node = vis.node(id);
        if(d3.select(this).style('opacity') == 0.7) {
            d3.select(this).style('opacity','1.0');
            // TODO: remove chart of info for node, since it is being 'unselected'
        }
        else {
            d3.select(this).style('opacity', '0.7');
            // TODO: add chart of info for input/output nodes, since they are being 'selected'
            if (node.type == 'process') {
                addProcessInfo(node.uri, processInputMapping[node.uri], processOutputMapping[node.uri]);
            }
        }
    });
}

/*
    @params: string URI
    @return: a parsed, human-readable substring of the URI
*/
var stripNameFromURI = function(uri) {
    if (uri.indexOf('CE_') <= -1) {
        return uri.substring(uri.lastIndexOf('/')+1, uri.length-13).toLowerCase();
    }
    return uri.substring(uri.lastIndexOf('CE_')+3, uri.length).toLowerCase();
}

var addDimensions = function(render) {
    render.shapes().customEllipse = function(parent, bbox, node) {
        var rx = bbox.width/2,
            ry = bbox.height/2,
            shapeSvg = parent.insert("ellipse", ":first-child")
            .attr('x', -bbox.width/2)
            .attr('y', -bbox.height/2)
            .attr('rx', rx)
            .attr('ry', ry)
            .attr('style', 'fill: #003366'); 
        if (node.dimensions > 1) {
            for (var i = 1; i < node.dimensions; i++) {
                shapeSvg = parent.insert("ellipse", ":first-child")
                .attr('x', -bbox.width/2)
                .attr('y', -bbox.height/2)
                .attr('rx', rx)
                .attr('ry', ry)
                .attr('style', "fill: #FFF; stroke: #003366")
                .attr('transform', 'translate(' + 0 + ',' + (bbox.height/10)*i + ')' + 'scale(' + '1.0' + ')');
            }
            
            shapeSvg = parent.insert("ellipse", ":first-child")
                .attr('x', -bbox.width/2)
                .attr('y', -bbox.height/2)
                .attr('rx', rx)
                .attr('ry', ry)
                .attr('transform', 'translate(' + 0 + ',' + (bbox.height/10)*(node.dimensions) + ')' + 'scale(' + '1.0' + ')');
                node.style = "fill: #FFF; stroke: #003366";
        }

        node.intersect = function(point) {
            return dagreD3.intersect.ellipse(node, rx, ry, point);
        };
        return shapeSvg;
    };
    
    render.shapes().customInputEllipse = function(parent, bbox, node) {
        var rx = bbox.width/2,
            ry = bbox.height/2,
            shapeSvg = parent.insert("ellipse", ":first-child")
            .attr('x', -bbox.width/2)
            .attr('y', -bbox.height/2)
            .attr('rx', rx)
            .attr('ry', ry)
            .attr('style', 'fill: #336633'); 
        
        if (node.dimensions > 1) {
            for (var i = 1; i < node.dimensions; i++) {
                shapeSvg = parent.insert("ellipse", ":first-child")
                .attr('x', -bbox.width/2)
                .attr('y', -bbox.height/2)
                .attr('rx', rx)
                .attr('ry', ry)
                .attr('style', "fill: #FFF; stroke: #336633")
                .attr('transform', 'translate(' + 3*i + ',' + (bbox.height/10)*i + ')' + 'scale(' + '1.0' + ')');
            }
            shapeSvg = parent.insert("ellipse", ":first-child")
                .attr('x', -bbox.width/2)
                .attr('y', -bbox.height/2)
                .attr('rx', rx)
                .attr('ry', ry)
                .attr('transform', 'translate(' + 3*(node.dimensions) + ',' + (bbox.height/10)*(node.dimensions) + ')' + 'scale(' + '1.0' + ')');
                node.style = "fill: #FFF; stroke: #336633";
        }

        node.intersect = function(point) {
            return dagreD3.intersect.ellipse(node, rx, ry, point);
        };
        return shapeSvg;
    };
    
    render.shapes().process = function(parent, bbox, node) {
        var width = bbox.width,
            height = bbox.height,
            shapeSvg = parent.insert('rect', ':first-child')
                .attr('rx', node.rx)
                .attr('ry', node.ry)
                .attr('x', -width/2)
                .attr('y', -height/2)
                .attr('width', width)
                .attr('height', height)
                .attr('style', 'fill: #FFCC99;');

        for (var i = 1; i < node.dimensions; i++) {
            shapeSvg = parent.insert('rect', ':first-child')
                .attr('rx', node.rx)
                .attr('ry', node.ry)
                .attr('x', -width/2 + (5*i))
                .attr('y', -height/2 + (5*i))
                .attr('width', width)
                .attr('height', height)
                .attr('style', 'fill: #FFCC99;');
        }
        node.intersect = function(point) {
            return dagreD3.intersect.rect(node, point);
        }
        return shapeSvg;
    }
}