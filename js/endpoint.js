var endpoint;
var endpoints;

function endpointonclick(event)  {
    var me = event.target;
    window.name = me.innerHTML;
    console.log(window.name);
    location.reload();
}
function readTextFile(file) {
        $.get(file, function(data) {
            endpoints = data.split(";");
            for(var i=0;i<endpoints.length;++i)
            {
                var a = '<a href="#" class="endpointurl" onclick="endpointonclick.call(this,event)">' + endpoints[i] + '</a>';
                document.getElementById("dropdown-content").innerHTML += a;        
            }
            if(window.name != "") endpoint = window.name;
            else endpoint = endpoints[0];
        });
    }


readTextFile("../txt/endpoints.txt");
