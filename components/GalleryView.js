import React, { Component } from 'react';

import constants from '../constants';

export default class Tour extends Component {
  state = {
    isCollapsed: {}
  }

  constructor(props) {
    super(props);
    const isCollapsed = {};
    const galleries = Object.keys(props.tour).sort();
    galleries.forEach(gallery => isCollapsed[gallery] = true);
    isCollapsed[galleries[0]] = false;
    this.state = {
      isCollapsed
    };
  }

  render() {
    const galleries = Object.keys(this.props.tour).sort();
    return (
      <div>
        {galleries.map(this.renderGallery, this)}
      </div>
    );
  }

  renderGallery = (gallery, index) => {
    const objects = this.props.tour[gallery].objects.length > 30 ? this.props.tour[gallery].objects.slice(0, 30) : this.props.tour[gallery].objects;
    return (
      <div key={index}>
        <div>
          <button onClick={this.handlePressCollapseGallery.bind(this, gallery)}>
            <div>
              <div>
                <span>{gallery}</span>
                {this.renderTagMatch(gallery)}
                {this.renderClassificationMatches(gallery)}
                {this.renderLocationMatches(gallery)}
              </div>
              <span>{`${this.props.tour[gallery].objects.length} ${this.props.tour[gallery].objects.length === 1 ? 'object' : 'objects'}`}</span>
            </div>
          </button>
        </div>
        <div>
          <div>
            {objects.map(this.renderObject)}
          </div>
        </div>
      </div>
    );
  }

  renderObject = (object, idx, arr) => {
    const lastChild = idx === arr.length - 1;
    return (
      <button key={idx} onClick={this.props.onSelectObject.bind(this, object)}>
        <div>
          <div>
            {this.state.isCollapsed[object.Location.GalleryShort] ? null : <img src={object.Thumbnail} />}
          </div>
          <span>{object.Title}</span>
        </div>
      </button>
    );
  }

  renderTagMatch(gallery) {
    if (this.props.tour[gallery].tagMatches.length === 0) return;
    return <span>⭐</span>;
  }

  renderClassificationMatches(gallery) {
    if (this.props.tour[gallery].classificationMatches.every(classification => !Object.keys(constants.classifications).includes(classification))) return;
    return (
      <div>
        {this.props.tour[gallery].classificationMatches.map(classification => <span key={classification}>{constants.classifications[classification]}</span>)}
      </div>
    );
  }

  renderLocationMatches(gallery) {
    if (this.props.tour[gallery].locationMatches.length === 0) return;
    return (
      <div>
        {this.props.tour[gallery].locationMatches.map(location => <span key={location}>{constants.countries[location]}</span>)}
      </div>
    );
  }

  handlePressCollapseGallery = gallery => {
    const { isCollapsed } = this.state;
    isCollapsed[gallery] = isCollapsed[gallery] === undefined ? false : !isCollapsed[gallery];
    this.setState({ isCollapsed });
  }
}
