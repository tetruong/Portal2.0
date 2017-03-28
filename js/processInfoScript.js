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

var sectionsShowing = [];
var sectionsShowingIds = [];
function addProcessInfo(processURI, inputsArray, outputsArray) {
    if (processInfosCount == 5) {
        // remove a process
				removeProcessInfo(sectionsShowingIds[0]);
		}
    // check that process div thing is not over count;
    
    // set header name
    var processName = stripNameFromURI(processURI);
    console.log(processName);
	
		var alreadyShowing = false;
		// Check that section is not already showing
		for (i = 0; i < sectionsShowing.length; i++) {
				if (sectionsShowing[i] == processName) {
					alreadyShowing = true;
				}
		}
		// Section is not already displayed on the page
		if (!alreadyShowing) {
			var nameHeader = document.getElementById("name_of_process_header");
			console.log(nameHeader);
			nameHeader.innerHTML = processName;

			sectionsShowing[processInfosCount] = processName;

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
			tableBody.parentNode.replaceChild(newTableBody, tableBody);

			var newProcessInfoDiv = document.createElement("div"); // create a new div
			newProcessInfoDiv.setAttribute("id", processInfosIndex);
			sectionsShowingIds[processInfosCount] = processInfosIndex;
			newProcessInfoDiv.setAttribute("class", "processInfo");
			var layoutDiv = document.getElementById("processInfoDivLayout");
			var layoutDivCopy = layoutDiv.cloneNode(true);
			layoutDivCopy.style.width = "90%";
			layoutDivCopy.style.display = "inline-block";
			
			newProcessInfoDiv.innerHTML = layoutDivCopy.innerHTML;
			
			document.body.appendChild(newProcessInfoDiv);
			console.log(processInfosCount);
			
			// add button listner
			var addedProcessInfoDiv = document.getElementById(processInfosIndex);
			var closeButton = addedProcessInfoDiv.getElementsByClassName("buttonCloseProcessInfo")[0];
			var index = processInfosIndex;
			closeButton.onclick = function() {removeProcessInfo(index)};

			
			processInfosCount = processInfosCount + 1;
			processInfosIndex = processInfosIndex + 1;
		}
}
    
function removeProcessInfo(removeId) {
    var divToRemove = document.getElementById(removeId);
    divToRemove.remove();
		// remove from lists that are keeping track of which processes are currently showing on page
		processInfosCount = processInfosCount - 1;
		for (i = 0; i < sectionsShowingIds.length; i++) {
			if (sectionsShowingIds[i] == removeId) {
				sectionsShowingIds.splice(i, 1);
				sectionsShowing.splice(i, 1);
				break;
			}
		}
	
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