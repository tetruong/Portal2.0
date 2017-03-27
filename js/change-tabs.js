$(document).ready(function() {
    $(".executionTab").click(function() {
        $('.nav-tabs a[href="#execution"]').tab('show');
        getExecutionID(localStorage.getItem('workflow-uri'), function(res) {
            renderVisualization(res, true);
        })
        
        var artifactSelect = document.getElementById('selection');
        artifactSelect.style.display = 'inline';
    });
    
    $(".workflowTab").click(function() {
        $('.nav-tabs a[href="#workflow"]').tab('show');
        
        getGraphJSON(workflowURI, function(res) {
            renderVisualization(res, false);
        });
        
        var artifactSelect = document.getElementById('selection');
        artifactSelect.style.display = 'none';
    });
});