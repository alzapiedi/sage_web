import React, { Component } from 'react';
import constants from '../constants';

export default class ClassificationFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      selectedKeywords: props.initialSelectedOptions ? new Set(props.initialSelectedOptions) : new Set()
    }
  }

  render() {
    const classifications = Object.keys(this.props.options);
    return (
      <div className="classification-filter">
        {classifications.map(this.renderClassification)}
      </div>
    );
  }

  renderClassification = (classification, idx) => {
    const isSelected = this.state.selectedKeywords.has(classification);
    const onClick = isSelected ? this.removeSelectedKeyword.bind(this, classification) : this.addSelectedKeyword.bind(this, classification);
    return (
      <div className="classification-option" key={idx}>
        <button className={isSelected ? "classification-button selected" : "classification-button"} onClick={onClick}>{this.props.options[classification]}</button>
        <span className="classification-label">{classification}</span>
      </div>
    );
  }

  addSelectedKeyword(keyword) {
    if (this.state.selectedKeywords.has(keyword)) return;
    this.props.onChange(keyword);
    this.setState({ selectedKeywords: this.state.selectedKeywords.add(keyword) });
  }

  removeSelectedKeyword(keyword) {
    const { selectedKeywords } = this.state;
    if (selectedKeywords.delete(keyword)) {
      this.setState({ selectedKeywords });
      this.props.onChange(keyword);
    }
  }
}
