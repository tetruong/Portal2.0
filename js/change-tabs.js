$(document).ready(function() {
    $(".executionTab").click(function() {
        $('.nav-tabs a[href="#execution"]').tab('show');
        // remove any panels showing on page 
        clearAllPanels();
        getExecutionID(localStorage.getItem('workflow-uri'), function(res, executionID) {
            renderVisualization(res, true);
            getExecutionDetails(executionID, function(res) {
                setWorkflowMetadata(res);
            })
        })
        
        var artifactSelect = document.getElementById('selection');
        artifactSelect.style.display = 'inline';
    });
    
    $(".workflowTab").click(function() {
        // remove any panels showing on page 
        clearAllPanels();
        $('.nav-tabs a[href="#workflow"]').tab('show');  
        getGraphJSON(workflowURI, function(res) {
            renderVisualization(res, false);
        });
        
        localStorage.setItem('workflow-uri', workflowURI);
        
        var artifactSelect = document.getElementById('selection');
        artifactSelect.style.display = 'none';
        
        for (var i = artifactSelect.options.length-1; i >= 0; i--) {
            artifactSelect.remove(i);
        }
    });
});

var setWorkflowMetadata = function(res) {
    //TODO: add error checking for null values
    //TODO: change time to human readable format
    document.getElementById('status-value').textContent = res.results.bindings[0].status.value;
    document.getElementById('label-value').textContent = res.results.bindings[0].label.value;
    document.getElementById('start-time-value').textContent = new Date(res.results.bindings[0].start.value).toString();
    document.getElementById('end-time-value').textContent = new Date(res.results.bindings[0].end.value).toString();
}