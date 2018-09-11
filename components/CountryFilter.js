import React, { Component } from 'react';

export default class CountryFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOptions: props.initialSelectedOptions ? new Set(props.initialSelectedOptions) : new Set()
    }
  }

  render() {
    const countries = Object.keys(this.props.options);
    return (
      <div className="country-filter">
        {countries.map(this.renderCountry, this)}
      </div>
    );
  }

  renderCountry = country => {
    const isSelected = this.state.selectedOptions.has(country);
    const onClick = isSelected ? this.removeSelectedOption.bind(this, country) : this.addSelectedOption.bind(this, country);
    return (
      <div key={country} className="country-option">
        <button className={isSelected ? "country-button selected" : "country-button"} onClick={onClick}>{this.props.options[country]}</button>
        <span className="country-label">{country}</span>
      </div>

    );
  }

  getSections() {
    const countries = Object.keys(this.props.options);
    return countries.map(country => ({ data: [country] }));
  }

  addSelectedOption(country) {
    if (this.state.selectedOptions.has(country)) return;
    this.props.onChange(country);
    this.setState({ selectedOptions: this.state.selectedOptions.add(country) });
  }

  removeSelectedOption(country) {
    const { selectedOptions } = this.state;
    if (selectedOptions.delete(country)) {
      this.setState({ selectedOptions });
      this.props.onChange(country);
    }
  }
}
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   countryText: {
//     fontSize: 18,
//     fontFamily: 'System',
//     color: '#222',
//   },
//   scrollView: {
//     backgroundColor: '#F5FCFF',
//     paddingBottom: 64
//   },
//   emojiContainer: {
//     alignItems: 'center',
//     backgroundColor: '#eee',
//     borderRadius: 35,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     justifyContent: 'center',
//     marginRight: 20,
//     height: 70,
//     width: 70
//   },
//   flexContainer: {
//     flex: 1,
//     alignItems: 'center',
//     flexDirection: 'row'
//   },
//   selectedOption: {
//     backgroundColor: '#ccc',
//     borderBottomColor: '#bbb',
//   },
//   touchable: {
//     borderBottomColor: '#ccc',
//     borderBottomWidth: 1,
//     flex: 1,
//     flexDirection: 'row',
//     padding: 20
//   },
//   optionText: {
//     fontSize: 48
//   }
// });
