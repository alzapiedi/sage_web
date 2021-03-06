import Autocomplete from 'react-autocomplete';
import React, { Component } from 'react';

import constants from '../constants';

export default class TagFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      selectedKeywords: props.initialSelectedOptions ? new Set(props.initialSelectedOptions) : new Set()
    }
  }

  render() {
    const { query, selectedKeywords } = this.state;
    const data = query.trim() === '' ? [] : this.props.options.filter(tag => tag.indexOf(query.toLowerCase().trim()) > -1).sort(this.sortAutocompleteData);
    return (
      <div className="tag-filter">
        {this.renderSelectedKeywords()}
        <Autocomplete
          getItemValue={item => item}
          items={data}
          renderItem={(item, isHighlighted) => <div key={item} className={isHighlighted ? 'autocomplete-item highlighted' : 'autocomplete-item'}>{item}</div>}
          renderInput={props => <input ref={node => this.autocompleteInput = node} className="autocomplete-input" {...props} />}
          open={data.length > 0}
          value={query}
          onChange={(e) => this.setState({ query: e.target.value || '' })}
          onSelect={this.handleSelectTag}
          wrapperStyle={{ display: 'flex', flex: 1 }}
        />
        <span className="random-tags-label">Here is a sample of tags that users have used on art matching your interests, tap to add them</span>
        {this.renderRandomTags()}
      </div>
    );
  }

  renderSelectedKeywords() {
    if (this.state.selectedKeywords.size === 0) return <div className="selected-tags"><span className="keywords-placeholder">Your selected keywords will appear here</span></div>
    return (
      <div className="selected-tags">
        {Array.from(this.state.selectedKeywords).map(this.renderSelectedKeyword)}
      </div>
    );
  }

  renderSelectedKeyword = (keyword, idx) => {
    return <button className="selected-tag" key={idx} onClick={this.removeSelectedKeyword.bind(this, keyword)}>{keyword}</button>;
  }

  renderRandomTags() {
    if (!this.props.randomTags) return;
    this.fontSizes = this.fontSizes || [];
    return (
      <div className="random-tags-container">
        {this.props.randomTags.map(this.renderRandomTag)}
      </div>
    );
  }

  renderRandomTag = (tag, idx) => {
    const { selectedKeywords } = this.state;
    this.fontSizes[idx] = this.fontSizes[idx] ? this.fontSizes[idx] : Math.random() < 0.08 ? 26 : Math.random() < 0.2 ? 22 : 16;
    return (
      <button className="random-tag" style={{ fontSize: this.fontSizes[idx] + 'px' }} key={idx} onClick={this.addSelectedKeyword.bind(this, tag.tag)}>{tag.tag}</button>
    );
  }

  getRandomTagsByPopularityLevel(numTags, popularityLevel) {
    const tags = constants.popular.filter(tag => {
      if (popularityLevel === 3) return tag.count >= 20;
      if (popularityLevel === 2) return tag.count >= 10 && tag.count < 20;
      if (popularityLevel === 1) return tag.count < 10;
    });
    const result = new Set();

    while (result.size < numTags) {
      let i = Math.round(Math.random() * (tags.length - 1));
      if (!result.has(tags[i].tag)) result.add(tags[i].tag);
    }

    return Array.from(result).map(tag => ({ tag, popularityLevel }));
  }

  handleSelectTag = tag => {
    this.addSelectedKeyword(tag, true);
  }

  addSelectedKeyword(keyword, clearQuery) {
    if (this.state.selectedKeywords.has(keyword)) return;
    this.props.onChange(keyword);
    this.setState({ selectedKeywords: this.state.selectedKeywords.add(keyword) });
    if (clearQuery) this.setState({ query: '' });
  }

  removeSelectedKeyword(keyword) {
    const { selectedKeywords } = this.state;
    if (selectedKeywords.delete(keyword)) {
      this.setState({ selectedKeywords });
      this.props.onChange(keyword);
    }
  }

  sortAutocompleteData = (a, b) => {
    if (a[0] === this.state.query[0].toLowerCase()) return -1;
    if (b[0] === this.state.query[0].toLowerCase()) return 1;
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  }
}
