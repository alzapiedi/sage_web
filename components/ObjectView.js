import React, { Component } from 'react';

import constants from '../constants';

export default class ObjectView extends Component {
  state = {
    customTag: '',
    isFullScreenImageOpen: false
  }

  render() {
    return (
      <div>
        <div>
          <div>
            <div>
              <span>{this.props.object.Title}</span>
            </div>
            <div>
              <button onClick={this.showFullScreenImage}>
                <img src={this.props.object.Image} />
              </button>
            </div>
          </div>
        </div>
        <div>
          <div>
            {this.renderArtist()}
            {this.renderClassification()}
            {this.renderCountry()}
            {this.renderDate()}
            {this.renderMedium()}
            {this.renderStyle()}
            {this.renderSocialTags()}
          </div>
        </div>
      </div>
    );
  }

  renderArtist() {
    if (!this.props.object.Artists || !this.props.object.Artists.length) return;
    return (
      <div>
        <span>Artist</span>
        <span>{this.props.object.Artists[0].Artist}</span>
      </div>
    );
  }

  renderClassification() {
    const classification = this.props.object.Classification;
    return (
      <div>
        <span>Classification</span>
        <span>{classification}</span>
      </div>
    );
  }

  renderCountry() {
    if (!this.props.object.Geography) return;
    const country = Object.keys(constants.countries).find(country => this.props.object.Geography.indexOf(country) > -1);
    return (
      <div>
        <span>Country</span>
        <span>{country}</span>
      </div>
    );
  }

  renderDate() {
    if (!this.props.object.Dated) return;
    return (
      <div>
        <span>Date</span>
        <span>{this.props.object.Dated}</span>
      </div>
    );
  }

  renderMedium() {
    if (!this.props.object.Medium) return;
    return (
      <div>
        <span>Medium</span>
        <span>{this.props.object.Medium}</span>
      </div>
    );
  }

  renderStyle() {
    if (!this.props.object.Style) return;
    return (
      <div>
        <span>Style</span>
        <span>{this.props.object.Style}</span>
      </div>
    );
  }

  renderSocialTags() {
    const tags = this.props.object.SocialTags;
    return (
      <div>
        <span>Social Tags:</span>
        <div>
          {!tags || !tags.length ? <span>No one has tagged this piece yet</span> : tags.map(this.renderSocialTag)}
        </div>
        <div>
          <input autoCorrect={false} onChange={event => this.setState({ customTag: event.target.value })} value={this.state.customTag} placeholder="Add your own tag!" />
          <button onClick={this.handleCreateTag}>+</button>
        </div>
      </div>
    );
  }

  renderSocialTag = (tag, idx, arr) => {
    const final = idx === arr.length - 1;
    return (
      <span key={tag}>{tag}{final ? null : ', '}</span>
    );
  }

  handleCreateTag = () => {
    if (!this.state.customTag || this.state.customTag === '') return alert('Enter a tag');
    this.props.createTag(this.props.object.ObjectID, this.state.customTag, () => {
      this.props.addObjectTag(this.state.customTag);
      this.setState({ customTag: '' });
    });
  }

  showFullScreenImage = () => {
    this.setState({ isFullScreenImageOpen: true });
  }

  hideFullScreenImage = () => {
    this.setState({ isFullScreenImageOpen: false });
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5FCFF',
//     paddingBottom: 64
//   },
//   fullScreen: {
//     flex: 1,
//     marginTop: 10
//   },
//   bottom: {
//     flex: 2,
//     padding: 10,
//   },
//   top: {
//     flex: 1,
//     paddingTop: 10,
//     paddingLeft: 10,
//     paddingRight: 10,
//   },
//   title: {
//     fontFamily: 'System',
//     fontSize: 18,
//     color: '#333',
//     fontWeight: 'bold',
//     width: 300
//   },
//   infoContainer: {
//     flex: 1,
//     backgroundColor: '#fdfdfd',
//     borderColor: '#ccc',
//     borderWidth: 1
//   },
//   header: {
//     backgroundColor: '#fefefe',
//     padding: 10,
//     borderBottomColor: '#ccc',
//     borderBottomWidth: 1,
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//   },
//   titleAndThumbnailContainer: {
//     borderColor: '#ccc',
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//     borderWidth: 1,
//     height: height / 3,
//     flex: 1,
//   },
//   thumbnailContainer: {
//     flex: 1,
//     backgroundColor: '#fdfdfd',
//     padding: 10
//   },
//   thumbnailImage: {
//     flex: 1,
//     resizeMode: 'contain'
//   },
//   fullScreenImage: {
//     flex: 1,
//     resizeMode: 'contain'
//   },
//   infoTop: {
//     flex: 1
//   },
//   socialTags: {
//     padding: 10,
//   },
//   entry: {
//     borderBottomColor: '#ccc',
//     borderBottomWidth: 1,
//     padding: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between'
//   },
//   entryKey: {
//     fontFamily: 'System',
//     fontWeight: 'bold'
//   },
//   entryValue: {
//     fontFamily: 'System',
//     maxWidth: width * 0.65
//   },
//   row: {
//     flexDirection: 'row',
//     flexWrap: 'wrap'
//   },
//   socialTag: {
//     fontFamily: 'System',
//     marginRight: 5
//   },
//   matchedTag: {
//     color: '#e83a17'
//   },
//   italic: {
//     fontStyle: 'italic'
//   },
//   tagInputContainer: {
//     alignItems: 'center',
//     marginTop: 10
//   },
//   tagInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 6,
//     marginRight: 10,
//     height: 35,
//     padding: 8,
//     width: width / 2
//   },
//   button: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     height: 35,
//     width: 35,
//     backgroundColor: '#b5ff6b'
//   }
// });
