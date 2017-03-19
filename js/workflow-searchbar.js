var searchbarAutocomplete = function(suggestions) {
    $( ".searchbar" ).autocomplete({
      /*Source refers to the list of fruits that are available in the auto complete list. */
      source:suggestions,
      /* auto focus true means, the first item in the auto complete list is selected by default. therefore when the user hits enter,
      it will be loaded in the textbox */
      autoFocus: true
    });
}