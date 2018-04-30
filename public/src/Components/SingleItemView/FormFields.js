import React from 'react';

import getFieldConfig from "../../utils/getFieldConfig";
import antValidation from "antvalidation";

// https://www.apollographql.com/docs/react/essentials/mutations.html

// import Spinner from './Spinner';
// import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
// import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
// import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
// import { Dropdown, DropdownMenuItemType } from 'office-ui-fabric-react/lib/Dropdown';
// import { Slider } from 'office-ui-fabric-react/lib/Slider';

import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

class FormFields extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: this.props.formData,
            errors: {}
        }
    }

    getErrorMessage = (field, value) => {
        value = value + ''; //only strings can be validated

        const ants = field.description || '';
        const errors = antValidation({ants, value});

        const formErrors = Object.assign({}, this.state.errors);
        formErrors[field.name] = errors;
        this.setState({
            errors: formErrors
        });

        return errors.join('\n');
    };

    getFieldsFromArguments = (_args, formData) => {
        const elements = _args.map(field => {
            const fieldConfig = getFieldConfig(field);

            const value = formData[field.name] !== undefined
                ? formData[field.name]
                : (fieldConfig.default !== undefined ? fieldConfig.default : '');

            const NoUI = fieldConfig.noui;

            return (!NoUI &&
                <div className="row" key={`field_${field.name}`}>
                    <label className="label">{field.name}: </label>
                    <span className="value">
                    <TextField
                        placeholder="Please fill"
                        description={field.description}
                        value={value}
                        onGetErrorMessage={ (value) => this.getErrorMessage(field, value) }
                        deferredValidationTime={200}
                        disabled={fieldConfig.nouserinput}
                        onChanged={ (value) => {
                            const formData = Object.assign({}, this.state.formData);
                            formData[field.name] = value;
                            this.setState({
                                formData
                            });
                        } }
                    />
                </span>
                </div>
            )
        });

        return elements;
    };


    render() {
        const { type } = this.props;
        const { formData } = this.state;
        const uiFields = this.getFieldsFromArguments(type.arguments, formData);
        const isFormInValid = !!Object.values(this.state.errors)
            .filter(fieldErrors => fieldErrors.length)
            .length;

        return (
            <div className="field">
                { uiFields }

                <DefaultButton
                    type="submit"
                    primary={ true }
                    disabled={ isFormInValid }
                >
                    Submit
                </DefaultButton>
            </div>
        );
    }
}

export default FormFields;