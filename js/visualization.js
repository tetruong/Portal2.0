d3.json('data.json', function(data) {
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
    
    var stripNameFromURI = function(uri) {
        return uri.substring(uri.lastIndexOf('_')+1, uri.length).toLowerCase();
    }
    
    var mapNodesEdges = function(graph) {
        var j = 0;
        for (var i = 0; i < results.length; i++) {
            var step = results[i].hasOwnProperty('step') ? results[i]['step']['value'] : null;
            step = stripNameFromURI(step);
            step = step.substring(0, step.lastIndexOf('node'));
            if (processNodeIndices[step] == null) {
                console.log("step: " + step);
                processNodeIndices[step] = j;
                vis.setNode(j, { 
                    label: step
                });
                j++;
            }
            if (results[i].hasOwnProperty('input')) {
                var input = results[i]['input']['value'];
                input = stripNameFromURI(input);
                if (putNodeIndices[input] == null) {
                    console.log("input: " + input);
                    putNodeIndices[input] = j;
                    vis.setNode(j, { 
                        label: input
                    });
                    j++;
                }
                addInputProcess(step, input);
            } else if (results[i].hasOwnProperty('output')) {
                var output = results[i]['output']['value'];
                output = stripNameFromURI(output);
                if (putNodeIndices[output] == null) {
                    console.log("output: "+ output);
                    putNodeIndices[output] = j;
                    console.log(output);
                    vis.setNode(j, { 
                        label: output
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
            vis.setEdge(putNodeIndices[processInputMapping[process][i]], processNodeIndices[process]);
        }
    }
    
    for (var process in processOutputMapping) {
        for (var i = 0; i < processOutputMapping[process].length; i++) {
            vis.setEdge(processNodeIndices[process], putNodeIndices[processOutputMapping[process][i]]);
        }
    }
    
    // Create the renderer
    var render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("svg").attr('width',2000).attr('height',2000),
        svgGroup = svg.append("g");

    // Run the renderer. This is what draws the final graph.
    render(d3.select("svg g"), vis);
    
});

// Create the input graph
//var g = new dagreD3.graphlib.Graph()
//  .setGraph({})
//  .setDefaultEdgeLabel(function() { return {}; });

// Here we"re setting nodeclass, which is used by our custom drawNodes function
//// below.
//g.setNode(0,  { label: "TOP",       });
//g.setNode(1,  { label: "S",         });
//g.setNode(2,  { label: "NP",        });
//g.setNode(3,  { label: "DT",        });
//g.setNode(4,  { label: "This",      });
//g.setNode(5,  { label: "VP",        });
//g.setNode(6,  { label: "VBZ",       });
//g.setNode(7,  { label: "is",        });
//g.setNode(8,  { label: "NP",        });
//g.setNode(9,  { label: "DT",        });
//g.setNode(10, { label: "an",        });
//g.setNode(11, { label: "NN",        });
//g.setNode(12, { label: "example",   });
//g.setNode(13, { label: ".",         });
//g.setNode(14, { label: "sentence",  });
//
//g.nodes().forEach(function(v) {
//  var node = g.node(v);
//  // Round the corners of the nodes
//  node.rx = node.ry = 5;
//});
//
//// Set up edges, no special attributes.
//g.setEdge(0, 1);
//g.setEdge(1, 2);
//g.setEdge(2, 3);
//g.setEdge(3, 4);
//g.setEdge(4, 5);

//// Create the renderer
//var render = new dagreD3.render();
//
//// Set up an SVG group so that we can translate the final graph.
//var svg = d3.select("svg").attr('width',1600).attr('height',900),
//    svgGroup = svg.append("g");
//
//// Run the renderer. This is what draws the final graph.
//render(d3.select("svg g"), g);
//
//// Center the graph
//var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
//svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
//svg.attr("height", g.graph().height + 40);



//force graph
//var w = 900,
//    h = 400;
//
//var circleWidth = 5;
//
//var palette = {
//      "lightgray": "#819090",
//      "gray": "#708284",
//      "mediumgray": "#536870",
//      "darkgray": "#475B62",
//
//      "darkblue": "#0A2933",
//      "darkerblue": "#042029",
//
//      "paleryellow": "#FCF4DC",
//      "paleyellow": "#EAE3CB",
//      "yellow": "#A57706",
//      "orange": "#BD3613",
//      "red": "#D11C24",
//      "pink": "#C61C6F",
//      "purple": "#595AB7",
//      "blue": "#2176C7",
//      "green": "#259286",
//      "yellowgreen": "#738A05"
//}
//
//var nodes = [
//    { name:"Parent" },
//    { name:"child1" },
//    { name:"child2", target:[0]},
//    { name:"child3", target:[0]},
//    { name:"child4", target:[1]},
//    { name:"child5", target:[0, 1, 2 ,3]}
//];
//
//var links = [];
//
//for (var i = 0; i<nodes.length; i++) {
//    if(nodes[i].target != undefined) {
//        for (var x = 0; x < nodes[i].target.length; x++) {
//            links.push({
//                source: nodes[i],
//                target: nodes[nodes[i].target[x]]
//            })
//        }
//    }
//}
//
//var myChart = d3.select('#chart')
//    .append('svg')
//    .attr('width', w)
//    .attr('height', h)
//
//var force = d3.layout.force()
//    .nodes(nodes)
//    .links([])
//    .gravity(0.1)
//    .charge(-1000)
//    .size([w,h])
//
//var link = myChart.selectAll('line')
//    .data(links).enter().append('line')
//    .attr('stroke', palette.gray)
//
//var node = myChart.selectAll('circle')
//    .data(nodes).enter().append('g')
//    .call(force.drag);
//
//node.append('circle')
//    .attr('cx', function(d) { return d.x; })
//    .attr('cy', function(d) { return d.y; })
//    .attr('r', circleWidth)
//    .attr('fill', palette.pink)
//
//node.append('text')
//    .text(function(d) { return d.name})
//    .attr('text-anchor', function(d, i) {
//        if (i > 0) { return 'beginning' }
//        else { return 'end' }
//    })
//    .attr('fill', function(d, i) {
//        if (i > 0) { return palette.mediumgray }
//        else { return palette.yellowgreen }
//    })
//    .attr('x', function(d,i) {
//        if (i > 0) { return circleWidth + 4 }
//        else { return circleWidth - 15 }
//    })
//    .attr('y', function(d,i) {
//        if (i > 0) { return circleWidth }
//        else { return 8 }
//    })
//    .attr('font-size', function(d,i) {
//        if (i > 0) { return '1em' }
//        else { return '1.8em' }
//    })
//
//force.on('tick', function(e) {
//    node.attr('transform', function(d, i) {
//        return 'translate('+d.x +', ' +  d.y + ')';
//    })
//    
//    link
//        .attr('x1', function(d) { return d.source.x; })
//        .attr('y1', function(d) { return d.source.y; })
//        .attr('x2', function(d) { return d.target.x; })
//        .attr('y2', function(d) { return d.target.y; })
//})
//
//force.start();


// d3.select('.item').text('select') takes first item matching that criteria
// d3.select('#chart .item').text('select')
// selectAll gives back kinda like an array like thing

// d3.select('#chart')
// 	.insert('span',':nth-child(3)')
// 	.html('<strong>selection</strong>')


// d3.select('#chart .item:nth-child(3)')
// 	.remove()

// d3.selectAll('.item')
// 	.attr('class','highlight') 

// d3.selectAll('.item:nth-child(3)')
// 	.classed({
// 		'highlight': true,
// 		'item': false,
// 		'bigger': true
// 	})

// d3.selectAll('.item:nth-child(3)')
// 	.style({
// 		'background': '#268BD2',
// 		'padding' : '10px'
// 	})

// var myStyles = [
// 		{
// 			width: 200,
// 			name: 'Huy Ngo',
// 			color: '#268BD2'},
// 		{
// 			width: 210,
// 			name:'Andrew Nguyen',
// 			color: '#BD3613'},
// 		{
// 			width: 220,
// 			name:'Tiffany Truong',
// 			color: '#D11C24'},
// 		{
// 			width: 230,
// 			name:'Blake Oler',
// 			color: '#C61C6F'},
// 		{
// 			width: 240,
// 			name:'Daniel Chee',
// 			color: '#595AB7'},
// 		{
// 			width: 250,
// 			name:'Conan Ngo',
// 			color: '#268BD2'},
// 		{
// 			width: 260,
// 			name:'Stan Ngo',
// 			color: '#BD3613'}
// ];

// d3.selectAll('.item')
// 	.data(myStyles)
// 	.style('background', function(d) {
// 		return d
// 	})


//adds HTML to DOM
// d3.selectAll('#chart').selectAll('div') //looks like we are selecting something that doesn't exist yet
// 	.data(myStyles)
// 	.enter().append('div')
// 	.classed('item',true)
// 	.text(function(d) {
// 		return d.name;
// 	})
// 	.style({
// 		'color' : 'white',
// 		'background' : function(d) {
// 			return d.color;
// 		},
// 		width: function(w) {
// 			return w.width + 'px';
// 		}
// 	})

// d3.select("#chart")
// 	.append('svg')
// 		.attr('width', 600)
// 		.attr('height', 400)
// 		.style('background', '#93a1a1')
// 	.append('rect')
// 		.attr('x',200)
// 		.attr('y',100)
// 		.attr('height', 200)
// 		.attr('width', 200)
// 		.attr('fill', '#Cb4b19')
// 	d3.select('svg')
// 		.append('circle')
// 			.attr('cx', 300)
// 			.attr('cy', 200)
// 			.attr('r', 50)
// 			.attr('fill', '#840043')

//bar chart
//var bardata = [];
//	d3.tsv('data.tsv', function(data) {
//
//	for (key in data) {
//		bardata.push(data[key].value)
//	}
//
//	var margin = { top: 30, right:30, bottom:40, left:50 }
//
//	var height = 400 - margin.top - margin.bottom,
//		width = 600 - margin.left - margin.right,
//		barWidth = 50,
//		barOffset = 5;
//
//	var colors = d3.scale.linear()
//		.domain([0,bardata.length*.33, bardata.length*.66, bardata.length])
//		.range(['#b58929', '#c61c6f', '#268bd2', '#85992c'])
//
//	var yScale = d3.scale.linear()
//		.domain([0,d3.max(bardata)])
//		.range([0, height])
//
//	var xScale = d3.scale.ordinal()
//		.domain(d3.range(0, bardata.length))
//		.rangeBands([0, width], .2) //.2 puts room between bars
//
//	var tooltip = d3.select('body').append('h1')
//		.style('position', 'absolute')
//		.style('padding', '0 10px')
//		.style('opacity', 0)
//	 
//	var myChart = d3.select('#chart')
//		.append('svg')
//		.style('background', "#E7E0CB")
//		.attr('height', height + margin.top + margin.bottom)
//		.attr('width', width + margin.left + margin.right)
//		.append('g')
//		.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
//		.selectAll('rect').data(bardata)
//		.enter().append('rect')
//			.style('fill', function(d,i) {
//				return colors(i);
//			})
//			.attr('width', xScale.rangeBand())
//			.attr('height', 0)
//			.attr('y', height)
//			.attr('x', function(d,i) { //data and index
//				return xScale(i)
//			})
//			
//		.on('mouseover', function(d) {
//			tooltip.transition()
//				.style('opacity', 0.9);
//
//			tooltip.html(d)
//				.style('left', (d3.event.pageX) + 'px')
//				.style('top', (d3.event.pageY + 35) + 'px')
//
//
//			tempColor = this.style.fill;
//			d3.select(this)
//				.style('opacity', 0.5)
//				.style('fill', 'yellow')
//		})
//		.on('mouseout', function(d) {
//			d3.select(this)
//				.style('opacity', 1)
//				.style('fill', tempColor)	
//		})
//
//
//	myChart.transition()
//			.attr('height', function(d) {
//				return yScale(d); //pass data through scale to remap
//			})
//			.attr('y', function(d) {
//				return height - yScale(d);
//			})
//			.delay(function(d,i) {
//				return i * 20;
//			}).
//			duration(1000)
//			.ease('elastic')
//
//
//	//create axes
//	var vGuideScale = d3.scale.linear()
//		.domain([0, d3.max(bardata)])
//		.range([height, 0])
//
//	var vAxis = d3.svg.axis()
//		.scale(vGuideScale)
//		.orient('left')
//		.ticks(10)
//
//	var vGuide = d3.select('svg').append('g')
//		vAxis(vGuide)
//		vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
//		vGuide.selectAll('path')
//			.style({ fill: 'none', stroke: '#000'}) // the fill of rectangle
//		vGuide.selectAll('line')
//			.style({ stroke: '#000'})
//
//	var hAxis = d3.svg.axis()
//		.scale(xScale)
//		.orient('bottom')
//		.tickValues(xScale.domain().filter(function(d,i) {
//			return !(i % (bardata.length/5));
//		}))
//
//	var hGuide = d3.select('svg').append('g')
//		hAxis(hGuide)
//		hGuide.attr('transform', 'translate(' + margin.left + ', ' +
//		 (margin.top + height) + ')')
//		hGuide.selectAll('path')
//			.style({ fill: 'none', stroke: '#000'}) // the fill of rectangle
//		hGuide.selectAll('line')
//			.style({ stroke: '#000'})
//	});

// for (var i=0; i < 50; i++) {
// 	bardata.push(Math.random()*100)
// }
//need to scale data to stretch width no matter how many points you have

// bardata.sort(function compareNumbers(a,b) {
// 	return a -b;
// });


//pie chart
//var width = 400,
//    height = 400,
//    radius = 200,
//    colors = d3.scale.ordinal().range([
//        '#595AB7', '#A57706', '#D11C24', '#c61c6f', '#bd3613',
//        '#2176c7', '#259286', '#738A05'
//    ]);
//
//var piedata = [
//    {
//        label: "Barot",
//        value: 50
//    },
//    {
//        label: "Gerard",
//        value: 50
//    },
//    {
//        label: "Jennifer",
//        value: 50
//    },
//    {
//        label: "Huy",
//        value: 50
//    },
//    {
//        label: "Gard",
//        value: 50
//    },
//    {
//        label: "Jennir",
//        value: 50
//    }
//]
//
//var pie = d3.layout.pie()
//    .value(function(d) {
//        return d.value;
//    })
//
//var arc = d3.svg.arc()
//    .outerRadius(radius)
//
//var myChart = d3.select("#chart").append('svg')
//    .attr('width',width)
//    .attr('height', height)
//    .append('g')
//        .attr('transform', 'translate(' + (width-radius)+','+(height-radius)+')')
//        .selectAll('path').data(pie(piedata))
//        .enter().append('g')
//            .attr('class', 'slice')
//
//var slices = d3.selectAll('g.slice')
//    .append('path')
//    .attr('fill',function(d,i) {
//                return colors(i);
//            })
//            .attr('d', arc)
//
//var text = d3.selectAll('g.slice')
//    .append('text')
//    .text(function(d,i) {
//        console.log(d);
//        return d.data.label;
//    })
//    .attr('text-anchor','middle')
//    .attr('fill','white')
//    .attr('transform', function(d) {
//        d.innerRadius = 0;
//        d.outerRadius = radius;
//        return 'translate(' + arc.centroid(d) + ')'
//    })