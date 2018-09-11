import React, { Component } from 'react';
import superagent from 'superagent';

import constants from './constants';
import ClassificationFilter from 'components/ClassificationFilter';
import CountryFilter from 'components/CountryFilter';
import TagFilter from 'components/TagFilter';
import Tour from 'components/Tour';

const API_BASE_URL = 'http://localhost:9000';
const FILTER_KEYS = ['classifications', 'countries', 'tags'];

export default class App extends Component {
  state = {
    activeView: 0,
    filter: {
      classifications: new Set(),
      countries: new Set(),
      tags: new Set()
    },
    filterKey: 'classifications'
  }

  render() {
    if (!this.state.filterKey && !this.state.tour) return <div>LOADING...</div>;
    if (this.state.tour) return this.renderTour();
    return this.renderFilterCreator();
  }

  renderTour() {
    return (
      <div className="sage-body">
        <Tour createTag={this.createTag} onReset={this.reset} tour={this.state.tour} />
      </div>
    );
  }

  renderClassificationFilter() {
    return (
      <div className="sage-body">
        <header>
          <h2>What are you interested in?</h2>
          <button className="forward" onClick={this.pushFilterScene.bind(this, 'countries')} />
        </header>
        <ClassificationFilter initialSelectedOptions={this.state.filter.classifications} options={constants.classifications} onChange={this.handleChangeFilterOptions} />
      </div>
    );
  }

  renderCountryFilter() {
    return (
      <div className="sage-body">
        <header>
          <button className="back" onClick={this.previousFilter} />
          <h2>Select Countries of Origin</h2>
          <button className="forward" onClick={this.fetchSocialTags} />
        </header>
        <CountryFilter initialSelectedOptions={this.state.filter.countries} options={constants.countries} onChange={this.handleChangeFilterOptions} />
      </div>
    );
  }

  renderTagFilter() {
    return (
      <div className="sage-body">
        <header>
          <button className="back" onClick={this.previousFilter} />
          <h2>Select Subjects of Interest</h2>
          <button className="forward" onClick={this.handleFilterComplete} />
        </header>
        <TagFilter
          initialSelectedOptions={this.state.filter.tags}
          randomTags={this.state.randomTags}
          options={constants.tags}
          onChange={this.handleChangeFilterOptions}
        />
      </div>
    );
  }

  renderFilterCreator() {
    switch(this.state.filterKey) {
      case 'classifications':
      return this.renderClassificationFilter();
    case 'countries':
      return this.renderCountryFilter();
    case 'tags':
      return this.renderTagFilter();
    }
  }

  handleChangeFilterOptions = option => {
    const { filter } = this.state;
    const selectedOptions = filter[this.state.filterKey];
    selectedOptions.has(option) ? selectedOptions.delete(option) : selectedOptions.add(option);
    this.setState({ filter });
  }

  pushFilterScene(filterKey) {
    if (this.state.filter.classifications.size === 0) return alert('Choose at least one category to continue');
    this.setState({ filterKey });
  }

  previousFilter = () => {
    const filterIndex = FILTER_KEYS.indexOf(this.state.filterKey);
    const filterKey = FILTER_KEYS[filterIndex - 1];
    this.setState({ filterKey });
  }

  handleFilterComplete = () => {
    const classifications = this.classifications;
    const countries = Array.from(this.state.filter.countries);
    const tags = Array.from(this.state.filter.tags);
    superagent.get(`${API_BASE_URL}/tour`)
      .query({ 'countries[]': countries, 'tags[]': tags, 'classifications[]': classifications })
      .then(res => {
        if (Object.keys(res.body).length === 0) return alert('No results for this search, please select more filters');
        this.setState({ tour: res.body });
      });
  }

  fetchSocialTags = () => {
    if (this.state.filter.countries.size === 0) return alert('Choose at least one country to continue');
    const classifications = this.classifications;
    const countries = Array.from(this.state.filter.countries);
    superagent.get(`${API_BASE_URL}/tags`)
      .query({ 'classifications[]': classifications, 'countries[]': countries })
      .then(res => this.setState({ randomTags: res.body }, this.pushFilterScene.bind(this, 'tags')));
  }

  reset = () => {
    this.setState({ filter: { classifications: new Set(), countries: new Set(), tags: new Set() }, tour: null, filterKey: 'classifications'});
  }

  createTag = (objectId, tag, onSuccess) => {
    superagent.post(`${API_BASE_URL}/add-tag`)
      .send({ objectId, tag })
      .then(res => this.handleCreateTagResponse(res.body, tag, onSuccess))
      .catch(e => this.handleCreateTagResponseError(e.status));
  }

  handleCreateTagResponse = (object, tag, onSuccess) => {
    const { tour } = this.state;
    const galleries = Object.keys(tour);
    onSuccess();
    galleries.forEach(gallery => {
      const obj = this.props.tour[gallery].find(o => o.ObjectID === object.ObjectID);
      if (!obj) return;
      obj.SocialTags ? obj.SocialTags.push(tag) : obj.SocialTags = [tag];
    });
    this.setState({ tour });
  }

  handleCreateTagResponseError(status) {
    if (!status) return;
    if (status === 501) return alert('You kiss your mother with that mouth?');
    if (status === 409) return alert('That tag already exists on this piece');
    return alert('An error occurred, please try again later');
  }

  get classifications() {
    const { classifications } = this.state.filter;
    if (!classifications.has('Other')) return Array.from(this.state.filter.classifications);
    const dup = new Set(classifications);
    dup.delete('Other');
    constants.other.forEach(c => dup.add(c));
    return Array.from(dup);
  }
}
