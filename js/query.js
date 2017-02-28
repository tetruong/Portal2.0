var populateSearchBar = function(handler) {
    var json = {};
    $.ajax({
        url: 'http://seagull.isi.edu:3030/ds/query?query=select+%3Fwf+%3Flabel+from+%3Curn%3Ax-arq%3AUnionGraph%3E+where%7B%0D%0A%0D%0A%3Fwf+a+%3Chttp%3A%2F%2Fwww.opmw.org%2Fontology%2FWorkflowTemplate%3E.%0D%0A%3Fwf++%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Flabel.%0D%0A%7D&output=json&stylesheet=',
        type: 'GET',
        cache: false,
        timeout: 30000,
        error: function(){
            handler({});
        },
        success: function(res){ 
            handler(res);
        }
    });
}