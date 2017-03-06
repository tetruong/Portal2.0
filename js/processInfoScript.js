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
    var newProcessInfoDiv = document.createElement("div"); // create a new div
    newProcessInfoDiv.setAttribute("id", processInfosIndex);
    newProcessInfoDiv.setAttribute("class", "processInfo");
    var layoutDiv = document.getElementById("processInfoDivLayout");
    var layoutDivCopy = layoutDiv.cloneNode(true);
    layoutDivCopy.style.display = "block";
    newProcessInfoDiv.innerHTML = layoutDivCopy.innerHTML;
    document.body.appendChild(newProcessInfoDiv);
    processInfosCount = processInfosCount + 1;
    processInfosIndex = processInfosIndex + 1;
    console.log(processInfosCount);
    
    
}
    
function removeProcessInfo(i) {
    var divToRemove = document.getElementById(i);
    divToRemove.remove();

}