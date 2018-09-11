import React, { Component } from 'react';

import GalleryView from './GalleryView';
import ObjectView from './ObjectView';

export default class Tour extends Component {
  state = {
    selectedObject: {}
  }

  render() {
    if (this.state.selectedObject.ObjectID) return this.renderObject();
    return (
      <div className="sage-tour">
        <header>
          <button className="back" onClick={this.props.onReset} />
          <h2>Tour</h2>
        </header>
        <GalleryView tour={this.props.tour} onSelectObject={this.selectObject} />
      </div>
    );
  }

  renderObject() {
    return (
      <div className="object-view">
        <header>
          <button className="back" onClick={this.backToGalleryView} />
          <h2>{this.getSelectedObjectTitle()}</h2>
        </header>
        <ObjectView addObjectTag={this.addObjectTag} object={this.state.selectedObject} tagMatches={this.getTagMatches()} createTag={this.props.createTag} />
      </div>
    );
  }

  backToGalleryView = () => {
    this.setState({ selectedObject: {} });
  }

  getSelectedObjectTitle = () => {
    if (!this.state.selectedObject.Location) return;
    return this.state.selectedObject.Location.GalleryShort;
  }

  getTagMatches = () => {
    const tags = this.state.selectedObject.SocialTags;
    if (!tags || !tags.length) return [];
    return tags.filter(tag => this.props.tour[this.state.selectedObject.Location.GalleryShort].tagMatches.includes(tag));
  }

  selectObject = selectedObject => {
    this.setState({ selectedObject });
  }

  addObjectTag = tag => {
    const { selectedObject } = this.state;
    selectedObject.SocialTags ? selectedObject.SocialTags.push(tag) : selectedObject.SocialTags = [tag];
    this.setState({ selectedObject });
  }
}
