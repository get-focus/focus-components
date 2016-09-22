import React, {Component, PropTypes} from 'react';
import Checkbox from '../input-checkbox';
import i18next from 'i18next';
import pull from 'lodash/pull';

class SelectCheckbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValues: this.props.value
        };
    }

    componentWillReceiveProps(newProps) {
        if(newProps) {
            this.setState({selectedValues: newProps.value});
        }
    }

    /**
    * Get the value from the select in the DOM.
    * @return {string} value
    */
    getValue() {
        return this.state.selectedValues;
    }

    /**
     * Handle a change of value.
     * @param  {[type]} key       the key
     * @param  {[type]} newStatus the new status
     */
    _handleCheckboxChange(key, newStatus) {
        if(this.props.onChange) {
            this.props.onChange(key, newStatus);
            return;
        }
        const selectedValues = this.state.selectedValues;
        if(newStatus) {
            selectedValues.push(key);
        } else {
            pull(selectedValues, key);
        }
        this.setState({value: selectedValues});
    }

    /**
     * Closure to capture key and checbox status.
     * @param  {[type]} key the key of checkbox
     * @return {[type]} status closure
     */
    _getCheckboxChangeHandler(key) {
        return (status) => {
            this._handleCheckboxChange(key, status);
        };
    }

    /**
     * Render all selection checkbox.
     * @return {ReactDOMNode} list of ReactDomNode
     */
    renderCheckboxes() {
        return this.props.values.map((val, idx) => {
            const value = val[this.props.valueKey];
            const label = val[this.props.labelKey];
            const isChecked = 0 <= this.state.selectedValues.indexOf(value);
            return (
                <Checkbox key={idx} label={i18next.t(label)} onChange={this._getCheckboxChangeHandler(value)} value={isChecked} />
            );
        });
    }

    render() {
        return (
            <div data-focus='select-checkbox'>
                {this.renderCheckboxes()}
            </div>
        );
    }
}

SelectCheckbox.displayName = 'SelectCheckbox';
SelectCheckbox.defaultProps = {
    values: [], // all values
    value: [], // selected values list
    valueKey: 'value', // key for the displayed value
    labelKey: 'label' // key for the displayed label
};
SelectCheckbox.propTypes = {
    values: PropTypes.array,
    value: PropTypes.array,
    valueKey: PropTypes.string,
    labelKey: PropTypes.string,
    onChange: PropTypes.func
};
export default SelectCheckbox;