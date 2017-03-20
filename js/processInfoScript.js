var processInfosCount = 0; // keep track of how many process info divs are shown
var processInfosIndex = 0;

//var closeProcessButton = document.getElementById("closeProcessButton");
//function closeProcessInfo() {
//    processInfosCount = processInfosCount - 1;    
//} 
//
//closeProcessButton.onclick = function() {closeProcessInfo()};o

window.onload = function() {
    var testShowButton = document.getElementById("tempAdd");
    var testCloseButton = document.getElementById("tempClose");

    // For testing
    testShowButton.onclick = function() {addProcessInfo()};
    testCloseButton.onclick = function() {removeProcessInfo(1)};
}


function addProcessInfo(processURI, inputsArray, outputsArray) {
    if (processInfosCount == 4) {
        // remove a 
    }
    // check that process div thing is not over count;
    
    // set header name
    var processName = stripNameFromURI(processURI);
    console.log(processName);
    var nameHeader = document.getElementById("name_of_process_header");
    nameHeader.innerHTML = processName;
    
    console.log(inputsArray);
    console.log(outputsArray);
    // Populate the table with variable data
    var l = inputsArray.length;
    if (outputsArray.length > l) {
        l = outputsArray.length;
    }
    // adding inputs and outputs to the table
    var tableBody = document.getElementById("process_info_table_body");
    var newTableBody = document.createElement("tbody");
    newTableBody.setAttribute("id", "process_info_table_body");
    for (i = 0; i < l; i++) {
        var row = newTableBody.insertRow(-1);
        // add input variable name and add output variable name (if applicable)
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        if (i < inputsArray.length) {
            cell1.innerHTML = stripNameFromURI(inputsArray[i]);
        }
        if (i < outputsArray.length) {
            cell2.innerHTML = stripNameFromURI(outputsArray[i]);
        }
    }
    console.log(tableBody.parentNode);
    tableBody.parentNode.replaceChild(newTableBody, tableBody);
    
    var newProcessInfoDiv = document.createElement("div"); // create a new div
    newProcessInfoDiv.setAttribute("id", processInfosIndex);
    newProcessInfoDiv.setAttribute("class", "processInfo");
    var layoutDiv = document.getElementById("processInfoDivLayout");
    var layoutDivCopy = layoutDiv.cloneNode(true);
    layoutDivCopy.style.display = "block";
    newProcessInfoDiv.innerHTML = layoutDivCopy.innerHTML;
    processInfosCount = processInfosCount + 1;
    processInfosIndex = processInfosIndex + 1;
    document.body.appendChild(newProcessInfoDiv);
    console.log(processInfosCount);
    
}
    
function removeProcessInfo(i) {
    var divToRemove = document.getElementById(i);
    divToRemove.remove();

}


function toggleChevron(e) {
    $(e.target)
        .prev('.panel-heading')
        .find("i.indicator")
        .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
}
$('#accordion').on('hidden.bs.collapse', toggleChevron);
$('#accordion').on('shown.bs.collapse', toggleChevron);

//$('.collapse').collapse("show")