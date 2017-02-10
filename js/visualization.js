d3.json('data.json', function(data) {
    var results = data['results']['bindings'];
    var processInputMapping = {};
    var processOutputMapping = {};
    var processNodeIndices = {};
    var inputNodeIndices = {};
    var outputNodeIndices = {};
    
    var addInputProcess = function(processName, inputName) {
        processInputMapping[processName] = processInputMapping[processName] || [];
        processInputMapping[processName].push(inputName);
    }
    
    var addOutputProcess = function(processName, outputName) {
        processOutputMapping[processName] = processOutputMapping[processName] || [];
        processOutputMapping[processName].push(outputName);
    }
    
    var stripNameFromURI = function(uri) {
        return uri.substring(uri.lastIndexOf('_')+1, uri.length).toLowerCase();
    }
    
    var mapInputs = function(graph) {
        var i = 0;
        for (var key in processInputMapping) {
            processNodeIndices[key] = i;
            var keyEdgeNum = i;
            if (processInputMapping.hasOwnProperty(key)) {
                inputVis.setNode(i, { label: key });
                i++;
                for (var j = 0; j < processInputMapping[key].length; j++) {
                    inputVis.setNode(i, { 
                        label: processInputMapping[key][j]
                    });
                    inputNodeIndices[processInputMapping[key][j]] = i;
                    inputVis.setEdge(i, keyEdgeNum);
                    i++;
                }
            }
        }
        return i;
    }
    
    for (var i = 0; i < results.length; i++) {
        var step = results[i].hasOwnProperty('step') ? results[i]['step']['value'] : null;
        step = stripNameFromURI(step);
        step = step.substring(0, step.lastIndexOf('node'));
        if (results[i].hasOwnProperty('input')) {
            var input = results[i]['input']['value'];
            input = stripNameFromURI(input);
            addInputProcess(step, input);
        } else if (results[i].hasOwnProperty('output')) {
            var output = results[i]['output']['value'];
            output = stripNameFromURI(output);
            addOutputProcess(step, output);
        }
    }
    
    var inputVis = new dagreD3.graphlib.Graph()
        .setGraph({})
        .setDefaultEdgeLabel(function() { return {} });
    
    var i = mapInputs(inputVis);
    
    for (var index in processNodeIndices) {
        var keyEdgeNum = processNodeIndices[index];
        for (var output in processOutputMapping) {
            if (output == index) {
                for (var j = 0; j < processOutputMapping[output].length; j++) {
                    if (inputNodeIndices[processOutputMapping[output][j]]) {
                        inputVis.setEdge(keyEdgeNum, inputNodeIndices[processOutputMapping[output][j]]);
                    } else {
                        inputVis.setNode(i, {
                            label: processOutputMapping[output][j]
                        });
                        inputVis.setEdge(keyEdgeNum, i);
                    }
                    outputNodeIndices[processOutputMapping[output][j]] = i;
                    i++;
                }
            }
        }
    }
    
    for (var index in outputNodeIndices) {
        if (inputNodeIndices[index] != null) {
            
        }
    }
    
    // Create the renderer
    var render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("svg").attr('width',2000).attr('height',2000),
        svgGroup = svg.append("g");

    // Run the renderer. This is what draws the final graph.
    render(d3.select("svg g"), inputVis);
    
});