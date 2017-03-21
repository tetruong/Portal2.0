var searchbarAutocomplete = function(suggestions) {
        
    $( "#workflow-searchbar" ).autocomplete({
        source:suggestions,
        appendTo: '.searchbar',
        select: function(event, ui) {
            localStorage.setItem('workflow-uri', ui.item.uri);
            window.location.reload(false);
        }
    });
    
    function removeDuplicates(value, index, self) { 
      return self.indexOf(value) === index;
    }
    
    $.ui.autocomplete.filter = function (array, term) {
        // This regex returns suggestions that start with the input
        const regexStartWith = new RegExp('^' + $.ui.autocomplete.escapeRegex(term), 'i');
        // This regex returns suggestions that contain the input anywhere in the suggestion string
        const regexContains = new RegExp($.ui.autocomplete.escapeRegex(term), 'i');

        var suggestionsStartWith = array.filter(workflowLabel => regexStartWith.test(workflowLabel.label));
        var suggestionsContains = array.filter(workflowLabel => regexContains.test(workflowLabel.label));
        var suggestions = suggestionsStartWith.concat(suggestionsContains);
        return suggestions.filter(removeDuplicates);
    };
}

window.onload = function() { 
    searchbarAutocomplete(JSON.parse(localStorage.getItem('workflow-suggestions')));
}
