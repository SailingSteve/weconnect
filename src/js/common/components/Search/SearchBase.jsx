import PropTypes from 'prop-types';
import React, { createRef } from 'react';
import styled from 'styled-components';
import colors from '../Style/Colors';
import normalizedImagePath from '../../utils/normalizedImagePath';

const closeIcon = normalizedImagePath('../../../img/global/svg-icons/cross.svg');
const searchIcon = normalizedImagePath('../../../img/global/svg-icons/search.svg');

class SearchBase extends React.Component {
  constructor (props) {
    super(props);
    this.state = { searchText: '' };
    this.inputRef = createRef();
  }

  componentDidMount () {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  handleInputChange = (event) => {
    this.setState({ searchText: event.target.value }, () => {
      if (this.props.onChange) {
        this.props.onChange(event);
      }
      if (this.props.onKeyDown) {
        this.props.onKeyDown(event);
      }
      if (this.props.onFocus) {
        this.props.onFocus(event);
      }
    });
  }

  handleClear = () => {
    this.setState({ searchText: '' }, () => {
      if (this.props.onClear) {
        this.props.onClear();
      }
    });
  }

  render () {
    return (
      <SearchBaseWrapper>
        {!this.state.searchText && <SearchIcon />}
        <SearchInput
          autoFocus
          maxLength={50}
          onBlur={this.props.onBlur}
          onChange={this.handleInputChange}
          placeholder={this.props.placeholder}
          ref={this.inputRef}
          type="search"
          value={this.state.searchText}
        />
        {this.state.searchText && <ClearButton onClick={this.handleClear} />}
      </SearchBaseWrapper>
    );
  }
}
SearchBase.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onClear: PropTypes.func,
};

const SearchBaseWrapper = styled('div')`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const SearchIcon = styled('div')`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: gray;
  background-image: url(${searchIcon});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 24px;
  height: 24px;
`;

const ClearButton = styled('div')`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background-image: url(${closeIcon});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const SearchInput = styled('input')`
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    display: none;
  }

  border: 1px solid rgb(206, 212, 218);
  height: 38px;
  width: 100%;
  border-radius: 0.25rem;
  padding-right: 40px;
  padding-left: 12px;

  &:focus-visible {
    border: none;
    outline: ${colors.primary} solid 2px !important;
  }
`;

export default SearchBase;
