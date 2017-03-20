var searchbarAutocomplete = function(suggestions) {
    $( "#workflow-searchbar" ).autocomplete({
        source:suggestions,
        appendTo: '.searchbar',
        select: function(event, ui) {
            localStorage.setItem('workflow-uri', ui.item.uri);
            window.location.reload(false);
        }
    });
}

window.onload = function() { 
    searchbarAutocomplete(JSON.parse(localStorage.getItem('workflow-suggestions')));
}
