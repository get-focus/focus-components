// Dependencies

import {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Base from '../../../behaviours/component-base';
import defaultLocale from './default-locale';
import InputText from '../text';
import DatePicker from 'react-date-picker';
import {compose} from 'lodash/function';

const isDateStringValid = compose(bool => !bool, isNaN, Date.parse);

const propTypes = {
    drops: PropTypes.oneOf(['up', 'down']).isRequired,
    error: PropTypes.string,
    formatter: PropTypes.func.isRequired,
    locale: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeHolder: PropTypes.string.isRequired,
    showDropdowns: PropTypes.bool.isRequired,
    validate: PropTypes.func,
    value: (props, propName, componentName) => {
        const prop = props[propName];
        if (prop && !isDateStringValid(prop)) {
            throw new Error(`The date (${prop}) is invalid for component ${componentName}. Please provide a valid date string.`);
        }
    }
};

const defaultProps = {
    drops: 'down',
    locale: defaultLocale,
    /**
    * Default onChange prop, that will log an error.
    */
    onChange() {
        console.error('You did not give an onChange method to an input date, please check your code.');
    },
    showDropdowns: true,
    validate: isDateStringValid,
    value: moment()
};

@Base
class InputDate extends Component {
    constructor(props) {
        super(props);
        const {value} = props;
        const state = {
            dropDownDate: isDateStringValid(value) ? moment(Date.parse(value)) : moment(),
            inputDate: this._formatDate(value, props.locale),
            displayPicker: false
        };
        this.state = state;
    }

    componentWillMount = () => {
        moment.locale('focus', this.props.locale);
        document.addEventListener('click', this._onDocumentClick);
    }


    componentDidMount = () => {
        const {drops, showDropdowns} = this.props;
        const {inputDate: startDate} = this.state;
    }

    componentWillReceiveProps = ({value}) => {
        this.setState({
            dropDownDate: moment(Date.parse(value)),
            inputDate: this._formatDate(value)
        });
    }

    componentWillUnmount = () => {
        document.removeEventListener('click', this._onDocumentClick);
    }

    isDateStringValid = (value, locale=this.props.locale) => moment(value, locale.longDateFormat[locale.format]).isValid();

    getValue = () => {
        const {inputDate} = this.state;
        const {locale} = this.props;
        const format = locale.longDateFormat[locale.format];
        return this.isDateStringValid(inputDate) ? moment(inputDate, format).toISOString() : null;
    }

    _formatDate = isoDate => {
        const {locale} = this.props;
        const format = locale.longDateFormat[locale.format];
        if (isDateStringValid(isoDate)) {
            return moment(isoDate).format(format);
        } else {
            return isoDate;
        }
    }

    _onInputChange = inputDate => {
        if (this.isDateStringValid(inputDate)) {
            const {locale} = this.props;
            const format = locale.longDateFormat[locale.format];
            const dropDownDate = moment(inputDate, format);
            this.setState({dropDownDate, inputDate});
        } else {
            this.setState({inputDate});
        }
    }

    _onInputBlur = () => {
        const {inputDate} = this.state;
        const {locale} = this.props;
        const format = locale.longDateFormat[locale.format];
        this.props.onChange(moment(inputDate, format).toISOString());
    }

    _onDropDownChange = (text, date) => {
        if (date._isValid) {
            this.setState({displayPicker: false}, () => {
                this._onInputChange(this._formatDate(date.toISOString())); // Add 12 hours to avoid skipping a day due to different locales
            });
        }
    }

    _onInputFocus = () => {
        this.setState({displayPicker: true});
    }

    _onDocumentClick = ({target}) => {
        const dataset = target ? target.dataset: null;
        const reactid = dataset ? dataset.reactid : null;
        const pickerId = ReactDOM.findDOMNode(this.refs.picker).dataset.reactid;
        const inputId = ReactDOM.findDOMNode(this.refs.input).dataset.reactid;
        if (reactid && !reactid.startsWith(pickerId) && !reactid.startsWith(inputId)) {
            this.setState({displayPicker: false});
        }
    }

    validate = (inputDate=this.state.inputDate) => {
        const isValid = this.isDateStringValid(inputDate);
        return {
            isValid,
            message: isValid ? '' : `${inputDate} is not a valid date.`
        };
    }

    render() {
        const {error, name, placeHolder} = this.props;
        const {dropDownDate, inputDate, displayPicker} = this.state;
        const {_onInputBlur, _onInputChange, _onInputFocus, _onDropDownChange, _onPickerCloserClick} = this;
        return (
            <div data-focus='input-date'>
                <InputText error={error} name={name} onBlur={_onInputBlur} onChange={_onInputChange} onFocus={_onInputFocus} placeHolder={placeHolder} ref='input' value={inputDate} />
                {displayPicker &&
                    <div data-focus='picker-zone'>
                        <DatePicker
                            date={dropDownDate}
                            hideFooter={true}
                            locale='focus'
                            onChange={_onDropDownChange}
                            ref='picker'
                            />
                    </div>
                }
            </div>
        );
    }
}

InputDate.propTypes = propTypes;
InputDate.defaultProps = defaultProps;
InputDate.displayName = 'InputDate';

export default InputDate;