var endpoint;
var endpoints = [
    "http://seagull.isi.edu:3030/ds/", 
    "http://disk.isi.edu:3030/ds/"
]

function endpointonclick(event)  {
    var me = event.target;
    localStorage.setItem("endpoint", me.innerHTML);
    testEndpoint(me.innerHTML);
    location.reload(true);
}
function readEndpoint() {
    /*    $.get(file, function(data) {    
    endpoints = data.split(/\r?\n/);    */
    for(var i=0;i<endpoints.length;++i)
    {
        var a = '<a href="#" class="endpointurl" onclick="endpointonclick.call(this,event)">' + endpoints[i] + '</a>';
        document.getElementById("dropdown-content").innerHTML += a;        
    }
    if(localStorage.getItem("endpoint")!=null) endpoint = localStorage.getItem("endpoint");
    else {
        endpoint = endpoints[0];
        localStorage.setItem("endpoint", endpoint);
    }
}


readEndpoint();
document.getElementById("chosenendpoint").innerHTML += localStorage.getItem("endpoint");

function getRamdomWorkflow()  {
    populateSearchBar(function(res) { 
        //executes after ajax call returns
        workflowSuggestions = parseAutocomplete(res);
        const shuffled = workflowSuggestions.sort(() => .5 - Math.random());// shuffle
        if(shuffled.length >= 7) {
            var selected =shuffled.slice(0,7); //get sub-array of first n elements AFTER shuffle
        }
        else {
            var selected =shuffled.slice(0,shuffled.length);
        }
        for(var i=0;i<4;++i) {
            var currentexample = $($(".workflowexample")[i]);
            currentexample.find("figcaption").html(selected[i].label + "<br>1 execution");
            var encryptedURI = CryptoJS.AES.encrypt(selected[i].uri, "csci401-Spring-2017");                
            currentexample.find(".overlay").attr("href", 'workflow-main.html?uri='+encryptedURI);
        }
    });
}

getRamdomWorkflow();