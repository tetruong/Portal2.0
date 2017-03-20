var searchbarAutocomplete = function(suggestions) {
    $( "#workflow-searchbar" ).autocomplete({
        source:suggestions,
        appendTo: '.searchbar',
        select: function(event, ui) {
            console.log(ui.item.uri);
        }
    });
}

window.onload = function() {
    searchbarAutocomplete(JSON.parse(localStorage.getItem('workflow-suggestions')));
}
