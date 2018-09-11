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
      <div style={styles.container}>
        {galleries.map(this.renderGallery, this)}
      </div>
    );
  }

  renderGallery = ({ item: gallery, index }) => {
    // const isCollapsed = this.state.isCollapsed[gallery];
    // const headerStyle = isCollapsed || isCollapsed === undefined ? [styles.galleryHeader, styles.galleryHeaderCollapsed] : styles.galleryHeader;
    const objects = this.props.tour[gallery].objects.length > 30 ? this.props.tour[gallery].objects.slice(0, 30) : this.props.tour[gallery].objects;
    return (
      <div key={index}>
        <div>
          <button onPress={this.handlePressCollapseGallery.bind(this, gallery)}>
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
        {/* <Collapsible collapsed={isCollapsed === undefined ? true : this.state.isCollapsed[gallery]}> */}
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
      <button key={idx} onPress={this.props.pushObjectScene.bind(this, object)}>
        <div>
          <div style={styles.thumbnailContainer}>
            {this.state.isCollapsed[object.Location.GalleryShort] ? null : <img style={styles.thumbnailImage} src={object.Thumbnail} />}
          </div>
          <span numberOfLines={5} style={styles.objectTitle}>{object.Title}</span>
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
      <div style={styles.row}>
        {this.props.tour[gallery].classificationMatches.map(classification => <span key={classification}>{constants.classifications[classification]}</span>)}
      </div>
    );
  }

  renderLocationMatches(gallery) {
    if (this.props.tour[gallery].locationMatches.length === 0) return;
    return (
      <div style={styles.row}>
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
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5FCFF',
//   },
//   gallery: {
//     backgroundColor: '#fcfcfc',
//     borderColor: '#ccc',
//     borderRadius: 10,
//     borderWidth: 1,
//     marginBottom: 15,
//   },
//   galleryHeader: {
//     backgroundColor: '#f5f5f5',
//     borderBottomColor: '#ccc',
//     borderBottomWidth: 1,
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//     overflow: 'hidden',
//     padding: 10
//   },
//   galleryHeaderCollapsed: {
//     borderBottomRightRadius: 10,
//     borderBottomLeftRadius: 10
//   },
//   galleryHeading: {
//     fontSize: 18,
//     marginRight: 5,
//   },
//   gallerySubheading: {
//     fontSize: 16,
//     fontStyle: 'italic',
//     color: '#ccc'
//   },
//   galleryObjects: {
//     flex: 1,
//     padding: 10
//   },
//   galleryCollapseTrigger: {
//     flexDirection: 'row',
//     justifyContent: 'space-between'
//   },
//   scrollView: {
//     backgroundColor: '#F5FCFF',
//     padding: 10,
//     paddingBottom: 64
//   },
//   object: {
//     alignItems: 'center',
//     flexDirection: 'row',
//     padding: 5,
//     paddingBottom: 10,
//     paddingTop: 10,
//   },
//   objectTitle: {
//     flex: 1,
//     margin: 10
//   },
//   thumbnailContainer: {
//     borderRadius: 8,
//     height: 75,
//     width: 75
//   },
//   thumbnailImage: {
//     borderRadius:8,
//     flex: 1,
//     resizeMode: 'cover'
//   },
//   row: {
//     alignItems: 'center',
//     flexDirection: 'row'
//   }
// });
