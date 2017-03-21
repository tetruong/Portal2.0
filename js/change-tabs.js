$(document).ready(function() {
    $(".executionTab").click(function() {
        $('.nav-tabs a[href="#execution"]').tab('show');
        getExecutionID(localStorage.getItem('workflow-uri'), function(res) {
        })
    });
    
    $(".workflowTab").click(function() {
        $('.nav-tabs a[href="#workflow"]').tab('show');
    });
    
});