/*
    @params: function "handler" that can be called when ajax call finishes
*/
var populateSearchBar = function(handler) {
    $.ajax({
        url: 'http://seagull.isi.edu:3030/ds/query?query=select+%3Fwf+%3Flabel+from+%3Curn%3Ax-arq%3AUnionGraph%3E+where%7B%0D%0A%0D%0A%3Fwf+a+%3Chttp%3A%2F%2Fwww.opmw.org%2Fontology%2FWorkflowTemplate%3E.%0D%0A%3Fwf++%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Flabel.%0D%0A%7D&output=json&stylesheet=',
        type: 'GET',
        cache: false,
        timeout: 30000,
        error: function(){
            handler({});
        },
        success: function(res){ 
            //success condition executes if ajax call goes through- we call the function handler, passing in the ajax response "res"
            handler(res);
        }
    });
}

var getInputs = function(workflow, handler) {
    var sparql = 'select ?input from <urn:x-arq:UnionGraph> where{?input <http://www.opmw.org/ontology/isVariableOfTemplate> <' + workflow + '>.?p <http://www.opmw.org/ontology/uses> ?input.FILTER NOT EXISTS {?input<http://www.opmw.org/ontology/isGeneratedBy> ?p2.}}';
    
    var endpointURI = "http://seagull.isi.edu:3030/ds/query?query=" + escape(sparql) + "&format=json";
    
    $.ajax({
        dataType :'jsonp',
        jsonp :'callback',
        url :endpointURI,
        success: function(res) {
            console.log(res);
        }
    });
}

var getGraphJSON = function(workflowURI, handler) {
    var sparql = 'select ?step ?input ?output from <urn:x-arq:UnionGraph> where{{?step <http://www.opmw.org/ontology/isStepOfTemplate> <' + workflowURI + '>.?step <http://www.opmw.org/ontology/uses> ?input.}UNION{?step <http://www.opmw.org/ontology/isStepOfTemplate> <' + workflowURI +'>.?output <http://www.opmw.org/ontology/isGeneratedBy> ?step.}}';
    
    var endpointURI = "http://seagull.isi.edu:3030/ds/query?query=" + sparql + "&format=json";
    
    $.ajax({
        url: endpointURI,
        type: 'GET',
        cache: false,
        timeout: 30000,
        error: function(){
            handler({});
        },
        success: function(res) {
            handler(res);
        }
    })
}