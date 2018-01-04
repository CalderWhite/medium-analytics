import React from "react";
import Autosuggest from 'react-autosuggest';

/**
 * Most of the following code was taken from the example in the README.md
 * All I added was the enter key functionality, and some styling.
 * Now this compoenent can be used out-of-the-box
 */

export default class SearchBar extends React.Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: [],
      hasHighlight:false
    };
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.keyCheck = this.keyCheck.bind(this);
  }
  getSuggestionValue(suggestion){
    return suggestion.name;
  }
  renderSuggestion({name, isBest, isLast},{isHighlighted}){
    if(isHighlighted){
      this.setState({
        hasHighlight:true
      })
    }
    if(isLast){
      this.setState({
        hasHighlight:false
      })
    }
    return(
      <div className={isHighlighted || (isBest && !this.state.hasHighlight) ? "selected-query" : ""}>
        {name}
      </div>
    )
  };
  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    if(inputLength > 0){
      let suggestions = this.props.data.filter(name =>
        name.toLowerCase().slice(0, inputLength) === inputValue
      ).map(name=>({name}))
      if(suggestions.length > 0){
        suggestions[0].isBest = true;
        suggestions[suggestions.length-1].isLast = true;
      }
      return suggestions;
    } else{
      return []
    }
  };
  onChange(event, {newValue, method}) {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  };
  keyCheck(event){
    // capture enter
    if(event.keyCode == 13){
      try{
      this.state.suggestions.map(({name,isBest})=>{
        if(isBest && !this.state.hasHighlight){
          this.props.onSelect(name)
        }
      })
      } catch(e){
        console.error(e)
      }
      event.preventDefault();
    }
  }

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: this.props.placeHolder,
      value,
      onChange: this.onChange,
      onKeyDown:this.keyCheck
    };

    // Finally, render it!
    return (
      <div className={this.props.className}>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={(event,{suggestion})=>this.props.onSelect(suggestion.name)}
      />
      </div>
    );
  }
}