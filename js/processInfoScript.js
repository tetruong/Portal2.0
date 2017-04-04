var processInfosCount = 0; // keep track of how many process info divs are shown
var processInfosIndex = 0;

//var closeProcessButton = document.getElementById("closeProcessButton");
//function closeProcessInfo() {
//    processInfosCount = processInfosCount - 1;    
//} 
//
//closeProcessButton.onclick = function() {closeProcessInfo()};o



//window.onload = function() {
//    var testShowButton = document.getElementById("tempAdd");
//    var testCloseButton = document.getElementById("tempClose");
//
//    // For testing
//    testShowButton.onclick = function() {addProcessInfo()};
//    testCloseButton.onclick = function() {removeProcessInfo(1)};
//}

var sectionsShowing = [];
var sectionsShowingIds = [];
var $template = $(".template");
var $templateVariables = $(".templ");
var $vis = $(".visualization-container");

function addProcessInfo(processURI, inputsArray, outputsArray) {
	if (processInfosCount == 0) {
		// resize the visualization container
		console.log("should reize");
		$vis.animate({
                "width": "60%"
            }, "slow");
	}
	// check that process div thing is not over count
	if (processInfosCount == 5) {
			// remove a process
			removeProcessInfo(sectionsShowing[0]);
	}
	
	// get name of node
	var processName = stripNameFromURI(processURI);
	console.log(processName);
		
	var alreadyShowing = false;
	// Check that section is not already showing
	for (i = 0; i < sectionsShowing.length; i++) {
			if (sectionsShowing[i] == processName) {
				alreadyShowing = true;
			}
	}
	if (alreadyShowing) {
			console.log("process is already showing!");
	}
	
	// panel isn't already displayed on page, so add it
	if (!alreadyShowing) {
		sectionsShowing[processInfosCount] = processName;
		var $newPanel = $template.clone();
		
		$newPanel.find(".collapse").removeClass("in");
		// set header name
		$newPanel.find(".accordion-toggle").attr("href", "#" + (processInfosIndex)).text("Process: " + processName);
		$newPanel.attr("id", processName);
		// link clicking on process name to expand collapse
		$newPanel.find(".panel-collapse").attr("id", processInfosIndex);

		// Populate the table with variable data
		var l = inputsArray.length;
		if (outputsArray.length > l) {
				l = outputsArray.length;
		}
		// adding inputs and outputs to the table
		var tableBody = $newPanel.find("table")[0];
		var newTableBody = document.createElement("tbody");
		newTableBody.setAttribute("class", "process_info_table_body");
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
		tableBody.append(newTableBody);
		
		// checkbox listeners for highlighting inputs and outputs
		// CHECKBOX - INPUTS
		var checkboxInputsWrapper = $newPanel.find("span")[1];
		var newCheckIn = document.createElement("input");
		newCheckIn.setAttribute("type", "checkbox");
		newCheckIn.setAttribute("class", "variable_input_check");
		newCheckIn.setAttribute("aria-label", "...");
		newCheckIn.setAttribute("id", "checkIn"+processName);
		var text = document.createElement("p");
		text.setAttribute("style", "display:inline-block;padding:1px 10px");
		text.innerHTML = "Highlight Inputs";
	
		checkboxInputsWrapper.append(newCheckIn);
		checkboxInputsWrapper.append(text);
		checkboxInputsWrapper.append(document.createElement("br"));

		console.log(checkboxInputsWrapper);

		$(document).on('click','#checkIn'+processName,function(){
			console.log(processURI);
			console.log(inputsArray);
			if ($(this).is(':checked')) {
				console.log("check the inputs");
			} else {
				console.log("uncheck the inputs");
			}
		});
		
		// CHECKBOX OUTPUTS
		var checkboxOutputsWrapper = $newPanel.find("span")[2];
		var newCheckIn = document.createElement("input");
		newCheckIn.setAttribute("type", "checkbox");
		newCheckIn.setAttribute("class", "variable_output_check");
		newCheckIn.setAttribute("aria-label", "...");
		newCheckIn.setAttribute("id", "checkOut"+processName);
		var text = document.createElement("p");
		text.setAttribute("style", "display:inline-block; padding:1px 10px");
		text.innerHTML = "Highlight Outputs";
	
		checkboxOutputsWrapper.append(newCheckIn);
		checkboxOutputsWrapper.append(text);
		checkboxOutputsWrapper.append(document.createElement("br"));

		console.log(checkboxOutputsWrapper);

		$(document).on('click','#checkOut'+processName,function(){
			console.log(processURI);
			console.log(inputsArray);
			if ($(this).is(':checked')) {
				console.log("check the outputs");
			} else {
				console.log("uncheck the outputs");
			}
		});

		// add new panel to the page
		$("#accordionInfo").append($newPanel.fadeIn());
		
		processInfosCount = processInfosCount + 1;
		processInfosIndex = processInfosIndex + 1;
	}


//		// Section is not already displayed on the page
//		if (!alreadyShowing) {
//			// set the name of the node
//			var nameHeader = document.getElementById("link_collapse_info");
//			console.log(nameHeader);
//			nameHeader.innerHTML = processName;
//
//			
//
//			console.log(inputsArray);
//			console.log(outputsArray);

//			// adding inputs and outputs to the table
//			var tableBody = document.getElementById("process_info_table_body");
//			var newTableBody = document.createElement("tbody");
//			newTableBody.setAttribute("id", "process_info_table_body");
//			for (i = 0; i < l; i++) {
//					var row = newTableBody.insertRow(-1);
//					// add input variable name and add output variable name (if applicable)
//					var cell1 = row.insertCell(0);
//					var cell2 = row.insertCell(1);
//					if (i < inputsArray.length) {
//							cell1.innerHTML = stripNameFromURI(inputsArray[i]);
//					}
//					if (i < outputsArray.length) {
//							cell2.innerHTML = stripNameFromURI(outputsArray[i]);
//					}
//			}
//			tableBody.parentNode.replaceChild(newTableBody, tableBody);
//
//			var newProcessInfoDiv = document.createElement("div"); // create a new div
//			newProcessInfoDiv.setAttribute("id", processInfosIndex);
//			sectionsShowingIds[processInfosCount] = processInfosIndex;
//			newProcessInfoDiv.setAttribute("class", "processInfo");
//			var layoutDiv = document.getElementById("accordionInfo");
//			var layoutDivCopy = layoutDiv.cloneNode(true);
//			layoutDivCopy.style.width = "90%";
//			layoutDivCopy.style.display = "inline-block";
//			
//			newProcessInfoDiv.innerHTML = layoutDivCopy.innerHTML;
//			
//			document.body.appendChild(newProcessInfoDiv);
//			console.log(processInfosCount);
//			
//			// add button listner
////			var addedProcessInfoDiv = document.getElementById(processInfosIndex);
////			var closeButton = addedProcessInfoDiv.getElementsByClassName("buttonCloseProcessInfo")[0];
////			var index = processInfosIndex;
////			closeButton.onclick = function() {removeProcessInfo(index)};
//
//		}
}
    

$(document).on('click', '.glyphicon-remove-circle', function () {
	var processName = $(this).parent().parent().attr("id");
  $(this).parents('.panel').get(0).remove();
	processInfosCount = processInfosCount - 1;
	for (i = 0; i < sectionsShowing.length; i++) {
		if (sectionsShowing[i] == processName) {
			sectionsShowingIds.splice(i, 1);
			sectionsShowing.splice(i, 1);
			break;
		}
	}
	if (processInfosCount == 0) {
		// resize the visualization container
		console.log("should reize");
		$vis.animate({
                "width": "100%"
            }, "slow");
	}
	
	console.log(sectionsShowing);
});

function removeProcessInfo(removeID) {
    var divToRemove = document.getElementById(removeID);
		console.log(divToRemove);
    divToRemove.remove();
		// remove from lists that are keeping track of which processes are currently showing on page
		processInfosCount = processInfosCount - 1;
		for (i = 0; i < sectionsShowing.length; i++) {
			if (sectionsShowing[i] == removeID) {
				sectionsShowingIds.splice(i, 1);
				sectionsShowing.splice(i, 1);
				break;
			}
		}
	
	if (processInfosCount == 0) {
		// resize the visualization container
		console.log("should reize");
		$vis.animate({
                "width": "100%"
            }, "slow");
	}
	console.log(sectionsShowing);
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