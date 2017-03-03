import React from 'react';
import ReactDOM from 'react-dom';
import Autosuggest from 'react-autosuggest';

const workflowNames = [
  {
    name: 'AquaFlow_NTM',
  },
  {
    name: 'AquaFlow_EDM',
  },
  {
    name: 'ASL Process',
  },
  {
    name: 'AbstractSubWfDocking',
  },
    {
    name: 'Andrew',
  },
  {
    name: 'ModelThenClassify',
  },
  {
    name: 'Stemming',
  },
  {
    name: 'Pre Process',
  }
];

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  
  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp(escapedValue, 'i');

  return workflowNames.filter(workflowName => regex.test(workflowName.name));
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

class SearchBar extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    };    
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
  }
    
  componentDidMount() {
      var suggestions = {};
      // call function to execute ajax call from query.js, passing into it, a function that takes in an input "res" which we define to execute when the ajax call returns successfully
      populateSearchBar(function(res) { 
          //executes after ajax call returns
          console.log(res);
      });
  }

  onChange(event, { newValue, method }) {
    this.setState({
      value: newValue
    });
  };
  
  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Search for Workflows",
      value,
      onChange: this.onChange
    };
    return (
      <Autosuggest 
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps} />
    );
  }
}

ReactDOM.render(<SearchBar />, document.getElementById('search-bar'));
