var processInfosCount = 0; // keep track of how many process info divs are shown
var processInfosIndex = 0;
var variableInfosCount = 0;
var variableInfosIndex = 0;


var variableSectionsShowing = [];
var variableSectionsShowingIds = [];
var sectionsShowing = [];
var sectionsShowingIds = [];
var $template = $(".template");
var $templateVariables = $(".templ");
var $vis = $(".visualization-container");

function closeLegend()  {
    var legend = document.getElementById("collapseLegend");
    if (legend.getAttribute("class")=="panel-collapse collapse in")  {
        $('#collapseLegend').collapse('hide');
    }
}

function checkOversize(currentelement)  {
    var process = document.getElementById("accordionInfo");
    var variable = document.getElementById("accordionVariables");
    var toplegend = document.getElementsByClassName("rightCanvas")[0];
    var left = document.getElementById("viz");

    var optionHeight = 0;
    if(currentelement.find("div:hidden").length)  {
    	var hiddenelement = currentelement.find("div:hidden")[0];
    	var previousCss  = $(hiddenelement).attr("style");
		$(hiddenelement).css({
    	    position:   'absolute', // Optional if #myDiv is already absolute
    	    visibility: 'hidden',
    	    display:    'block'
    	});
		optionHeight = $(hiddenelement).height();
		$(hiddenelement).attr("style", previousCss ? previousCss : "");
	}
	if(currentelement.attr("id") == "togglelegendlink")  optionHeight = 96;
	if(optionHeight == 0)  optionHeight=150;
	console.log(optionHeight);
    if(process.clientHeight + variable.clientHeight + toplegend.clientHeight + optionHeight> left.clientHeight)  {
        //console.log(process.clientHeight, variable.clientHeight, toplegend.clientHeight);
        //console.log(left.clientHeight);
        return true;
    }
    //console.log(process.clientHeight, variable.clientHeight, toplegend.clientHeight);
    //console.log(left.clientHeight);
    //console.log("false");
    return false;
}

function fitinScreen(currentelement)  {
    if(checkOversize(currentelement) && currentelement.attr("id") != "togglelegendlink")  {
        closeLegend();
        //console.log(0);
    }
    //console.log(1);
    for(var i=processInfosIndex-processInfosCount;i<processInfosIndex;i++)  {
        //console.log(2);
        if(!checkOversize(currentelement)) return;
        if($('#'+sectionsShowing[i])!=currentelement)  {
            var thisid = '#' + i.toString();
            $(thisid).collapse('hide');
        }
    }
    for(var i=variableInfosIndex-variableInfosCount;i<variableInfosIndex;i++)  {
        //console.log(3);
        if(!checkOversize(currentelement)) return;
        if($('#'+variableSectionsShowing[i])!=currentelement)  {
            var thisid = '#v' + i.toString();
            $(thisid).collapse('hide');
        }
    }
}

function addProcessInfo(processURI, inputsArray, outputsArray) {
	if (processInfosCount == 0 && variableInfosCount == 0) {
		// resize the visualization container
        translateVisualization();
		console.log("should reize");
		$vis.animate({
                "width": "65%"
            }, "slow");
	}	
	
	// get name of node
	var processName = stripNameFromURI(processURI);
	console.log(processName);
		
	var alreadyShowing = false;
	// Check that section is not already showing
	for (var i = 0; i < sectionsShowing.length; i++) {
			if (sectionsShowing[i] == processName) {
				alreadyShowing = true;
			}
	}
	if (alreadyShowing) {
			console.log("process is already showing!");
	}
	
	// panel isn't already displayed on page, so add it
	if (!alreadyShowing) {
		// check that process div thing is not over count
		if (processInfosCount == 3) {
			console.log(sectionsShowing);
			// remove a process
			removeProcessInfo(sectionsShowing[0]);
		}

		
		
		sectionsShowing[processInfosCount] = processName;
		var $newPanel = $template.clone();
		
		
//		$newPanel.find(".collapse").removeClass("in");
		// set header name
        var accordionToggle = $newPanel.find(".accordion-toggle");

        accordionToggle.click(function() {
            unhighlightAllPuts();
            highlightPuts(inputsArray);
            highlightPuts(outputsArray);
            fitinScreen($newPanel);
        });
        
		$newPanel.find(".accordion-toggle").attr("href", "#" + (processInfosIndex)).text("Process: " + processName);
		$newPanel.attr("id", processName);
		// link clicking on process name to expand collapse
		$newPanel.find(".panel-collapse").attr("id", processInfosIndex);
        
        //add link to RDFImage
        $newPanel.find("#RDFImage-variable-link").prop("href", processURI);
        $newPanel.find("#RDFVariableLink").html(processURI);
		// Populate the table with variable data
		var l = inputsArray.length;
		if (outputsArray.length > l) {
				l = outputsArray.length;
		}
		// adding inputs and outputs to the table
		var tableBody = $newPanel.find("table")[0];
		var newTableBody = document.createElement("tbody");
		newTableBody.setAttribute("class", "process_info_table_body");
		for (var i = 0; i < l; i++) {
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
		
//		// checkbox listeners for highlighting inputs and outputs
//		// CHECKBOX - INPUTS
//		var checkboxInputsWrapper = $newPanel.find("span")[1];
//		var newCheckIn = document.createElement("input");
//		newCheckIn.setAttribute("type", "checkbox");
//		newCheckIn.setAttribute("class", "variable_input_check");
//		newCheckIn.setAttribute("aria-label", "...");
//		newCheckIn.setAttribute("id", "checkIn"+processName);
//		var text = document.createElement("p");
//		text.setAttribute("style", "display:inline-block;padding:1px 10px");
//		text.innerHTML = "Highlight Inputs";
//	
//		checkboxInputsWrapper.append(newCheckIn);
//		checkboxInputsWrapper.append(text);
//		checkboxInputsWrapper.append(document.createElement("br"));
//
//		console.log(checkboxInputsWrapper);
//
//		$(document).on('click','#checkIn'+processName,function(){
//			console.log(processURI);
//			console.log(inputsArray);
//			if ($(this).is(':checked')) {
//				highlightPuts(inputsArray);
//			} else {
//				unhighlightPuts( inputsArray);
//			}
//		});
//		
//		// CHECKBOX OUTPUTS
//		var checkboxOutputsWrapper = $newPanel.find("span")[2];
//		var newCheckIn = document.createElement("input");
//		newCheckIn.setAttribute("type", "checkbox");
//		newCheckIn.setAttribute("class", "variable_output_check");
//		newCheckIn.setAttribute("aria-label", "...");
//		newCheckIn.setAttribute("id", "checkOut"+processName);
//		var text = document.createElement("p");
//		text.setAttribute("style", "display:inline-block; padding:1px 10px");
//		text.innerHTML = "Highlight Outputs";
//	
//		checkboxOutputsWrapper.append(newCheckIn);
//		checkboxOutputsWrapper.append(text);
//		checkboxOutputsWrapper.append(document.createElement("br"));
//
//		console.log(checkboxOutputsWrapper);
//
//		$(document).on('click','#checkOut'+processName,function(){
//			console.log(processURI);
//			console.log(inputsArray);
//			if ($(this).is(':checked')) {
//				highlightPuts(outputsArray);
//			} else {
//				unhighlightPuts(outputsArray);
//			}
//		});

		// add new panel to the page
		processInfosCount = processInfosCount + 1;
		processInfosIndex = processInfosIndex + 1;
		fitinScreen($newPanel);
		$("#accordionInfo").append($newPanel.fadeIn("slow"));
	}
}
    

// FUNCTION TO ADD NEW VARIABLE INFORMATION SECTIONS
function addVariableInfo(variableURI, usedBy, generatedBy, variableType, artifactValues) {
	if (processInfosCount == 0 && variableInfosCount == 0) {
		// resize the visualization container
		console.log("should reize");
        translateVisualization();
		$vis.animate({
                "width": "65%"
            }, "slow");
	}
	console.log(artifactValues);
	
	
	// get name of node
	var variableName = stripNameFromURI(variableURI);
	console.log(variableName);
		
	var alreadyShowing = false;
	// Check that section is not already showing
	for (i = 0; i < variableSectionsShowing.length; i++) {
			if (variableSectionsShowing[i] == variableName) {
				alreadyShowing = true;
			}
	}
	if (alreadyShowing) {
			console.log("variable is already showing!");
	}
	
	// panel isn't already displayed on page, so add it
	if (!alreadyShowing) {
		// check that variable div thing is not over count
		if (variableInfosCount == 3) {
			// remove a variable
			removeVariableInfo(variableSectionsShowing[0]);
		}

		

		variableSectionsShowing[variableInfosCount] = variableName;
		var $newPanel = $templateVariables.clone();
		
//		$newPanel.find(".collapse").removeClass("in");
		// set header name
		var variableTypeHeading = variableType.charAt(0).toUpperCase() + variableType.slice(1);
		$newPanel.find(".accordion-toggle").attr("href", "#v" + (variableInfosIndex)).text(variableTypeHeading + " Variable: " + variableName);
        $newPanel.find(".accordion-toggle").click(function()  {
            fitinScreen($newPanel);
        });

		$newPanel.attr("id", variableName);
		// link clicking on process name to expand collapse
		$newPanel.find(".panel-collapse").attr("id", "v" + variableInfosIndex);
        
        //add link to RDFImage
        $newPanel.find("#RDFImage-variable-link").prop("href", variableURI);
        $newPanel.find("#RDFVariableLink").html(variableURI);
        
		// show variable type and generated by info
		/*var textVarType = $newPanel.find("div")[6];
		var newName = document.createElement("strong");
		newName.innerHTML = variableType;
		textVarType.append(newName);*/
		
		// Generated By
		var textGeneratedBy = $newPanel.find("div")[7];
		var newGeneratedBy = document.createElement("li");
		//newGeneratedBy.innerHTML = " - ";
		// ----------TODO----------
		if (typeof generatedBy != 'undefined') {
			newGeneratedBy.innerHTML = stripNameFromURI(generatedBy[0]);
		} else {
			newGeneratedBy.innerHTML = "-";
		}
		textGeneratedBy.append(newGeneratedBy);
		
		// show list of used by processes
		var listUsedBy = $newPanel.find("ul")[0];
		if (typeof usedBy != 'undefined') {
			for (var i = 0; i < usedBy.length; i++) {
				var newListItem = document.createElement("li");
				newListItem.innerHTML = stripNameFromURI(usedBy[i]);
				listUsedBy.append(newListItem);
			}
		}
		else {
			var newListItem = document.createElement("li");
			newListItem.innerHTML = "-";
			listUsedBy.append(newListItem);
		}
		
		// Check which tab is showing based on the selected/active index
		// if index 1 is selected, we are on the execution tab
		// otherwise, on the index 0 tab we are on the main workflow page and do not want any file info
		// displayed for variables
		var fileInfo = $newPanel.find("div")[11];
		if ($("ul.nav li.active").index() == 0) {
			fileInfo.setAttribute("style", "display:none");
		} else {
				fileInfo.setAttribute("style", "display:block");
				// show list of files in dropdown and w/ handler to update link
				/*var fileSelector = $newPanel.find("select")[0];

				$($newPanel).find("#file-selector").attr("id","file-selector-"+variableName);
				if (artifactValues.length == 0) {
					$($newPanel).find("#file-selector").attr("disabled","disabled");
				} 
				var defaultFile = document.createElement("option");
				defaultFile.innerHTML = " - ";
				fileSelector.append(defaultFile);
				console.log(artifactValues.bindings);
				for (var i = 0; i < artifactValues.bindings.length; i++) {
					var newFile = document.createElement("option");
					newFile.innerHTML = artifactValues.bindings[i].file.type;
					console.log(artifactValues.bindings[i].file.type);
					fileSelector.append(newFile);
				}*/
				// file download link
				var downloadSpan = $newPanel.find("span")[2];
				var downloadLink = document.createElement("a");
				downloadLink.setAttribute("style", "margin-left:8px");
				downloadLink.setAttribute("id", "download-link-"+variableName);
				if(artifactValues.bindings[0]!=null)  {
					downloadLink.innerHTML = artifactValues.bindings[0].file.type;
					downloadLink.setAttribute("target", "_blank");
					downloadLink.setAttribute("href", artifactValues.bindings[0].file.value);
				}
				else downloadLink.innerHTML = "No download available";
				downloadSpan.append(downloadLink);

				/*$newPanel.on('change','#file-selector-'+variableName,function(){
					var selector = document.getElementById("file-selector-"+variableName);
					var selectedText = selector.options[selector.selectedIndex].text;
					var link = document.getElementById("download-link-"+variableName);
					link.innerHTML = selectedText;
					if (selector.selectedIndex !=0 ) {
							link.setAttribute("href", artifactValues.bindings[selector.selectedIndex-1].file.value);
					} else {
						link.removeAttribute("href");
					}
				});*/
		}
				
		// add new panel to the page
		

		variableInfosCount = variableInfosCount + 1;
		variableInfosIndex = variableInfosIndex + 1;
		fitinScreen($newPanel);
		$("#accordionVariables").append($newPanel.fadeIn("slow"));
	}
}


function clearAllPanels() {
	// remove all panels from the page
	var sectionsShowingCopy = sectionsShowing.slice();
	var variableSectionsShowingCopy = variableSectionsShowing.slice();
	unhighlightAllPuts();
	for (var i = 0; i < sectionsShowingCopy.length; i++) {
		removeProcessInfo(sectionsShowingCopy[i]);	
	}
	for (var j = 0; j < variableSectionsShowingCopy.length; j++) {
		removeVariableInfo(variableSectionsShowingCopy[j]);
	}
	// reset any counters and other things
	processInfosCount = 0
	variableInfosCount = 0;
	processInfosIndex = 0;
	variableInfosIndex = 0;
	sectionsShowing = [];
	sectionsShowingIds = [];
	variableSectionsShowing = [];
	variableSectionsShowingIds = [];
}

$(document).on('click', '.glyphicon-remove-circle', function () {
	var processName = $(this).parent().parent().attr("id");
  $(this).parents('.panel').get(0).remove();
	processInfosCount = processInfosCount - 1;
	for (var i = 0; i < sectionsShowing.length; i++) {
		if (sectionsShowing[i] == processName) {
			sectionsShowingIds.splice(i, 1);
			sectionsShowing.splice(i, 1);
			break;
		}
	}
	if (processInfosCount == 0 &&  variableInfosCount == 0) {
		// resize the visualization container
		console.log("should reize");
		unhighlightAllPuts();
		$vis.animate({
                "width": "65%"
            }, "slow");
	}
});


$(document).on('click', '.glyphicon-remove-sign', function () {
	var variableName = $(this).parent().parent().attr("id");
  $(this).parents('.panel').get(0).remove();
	variableInfosCount = variableInfosCount - 1;
	for (var i = 0; i < variableSectionsShowing.length; i++) {
		if (variableSectionsShowing[i] == variableName) {
			variableSectionsShowingIds.splice(i, 1);
			variableSectionsShowing.splice(i, 1);
			break;
		}
	}
	if (processInfosCount == 0 &&  variableInfosCount == 0) {
		// resize the visualization container
		console.log("should reize");
		unhighlightAllPuts();
		$vis.animate({
                "width": "65%"
            }, "slow");
	}
});

function removeVariableInfo(removeID) {
	var divToRemove = document.getElementById(removeID);
	console.log(divToRemove);
	divToRemove.remove();
	// remove from lists that are keeping track of which processes are currently showing on page
	variableInfosCount = variableInfosCount - 1;
	for (var i = 0; i < variableSectionsShowing.length; i++) {
		if (variableSectionsShowing[i] == removeID) {
			variableSectionsShowingIds.splice(i, 1);
			variableSectionsShowing.splice(i, 1);
			break;
		}
	}

	if (processInfosCount == 0 && variableInfosCount == 0) {
		// resize the visualization container
		console.log("should reize");
		unhighlightAllPuts();
		$vis.animate({
						"width": "65%"
					}, "slow");
	}
}


function removeProcessInfo(removeID) {
    var divToRemove = document.getElementById(removeID);
		console.log(divToRemove);
    divToRemove.remove();
		// remove from lists that are keeping track of which processes are currently showing on page
		processInfosCount = processInfosCount - 1;
		for (var i = 0; i < sectionsShowing.length; i++) {
			if (sectionsShowing[i] == removeID) {
				sectionsShowingIds.splice(i, 1);
				sectionsShowing.splice(i, 1);
				break;
			}
		}
	
	if (processInfosCount == 0 && variableInfosCount == 0) {
		// resize the visualization container
		console.log("should reize");
		unhighlightAllPuts();
		$vis.animate({
                "width": "65%"
            }, "slow");
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

