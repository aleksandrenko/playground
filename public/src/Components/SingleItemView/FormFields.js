import React from 'react';

import getFieldConfig from "../../utils/getFieldConfig";
import antValidation from "antvalidation";

// https://www.apollographql.com/docs/react/essentials/mutations.html

import { Dropdown, DropdownMenuItemType } from 'office-ui-fabric-react/lib/Dropdown';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

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

    onChanged = (value, field) => {
        const formData = Object.assign({}, this.state.formData);

        formData[field.name] = value;

        this.setState({
            formData
        });
    };

    getFieldsFromArguments = (_args, formData) => {
        const elements = _args.map(field => {
            const fieldConfig = getFieldConfig(field);
            const inputType = field.type;

            const isString = inputType === 'String';
            const isBoolean = inputType === 'Boolean';

            const enums = this.props.serverSchema.enums;
            const usedEnum = enums.filter(_enum => Object.keys(_enum)[0] === inputType)[0];
            const isUIDropDown = !!usedEnum;
            const enumValues = Object.values(usedEnum || {})[0];
            const dropDownOptions = enumValues && enumValues.map(val => ({
                key: val,
                text: val
            }));

            const value = formData[field.name] !== undefined
                ? formData[field.name]
                : (fieldConfig.default !== undefined ? fieldConfig.default : '');

            const NoUI = fieldConfig.noui;

            return (!NoUI &&
                <div className="row" key={`field_${field.name}`}>
                    <label className="label">{field.name}: </label>
                    <span className="value">

                    { isUIDropDown &&
                        <Dropdown
                            placeHolder={`Select an ${field.name}.`}
                            options={dropDownOptions}
                            value={value}
                            onChanged={ (value) => { this.onChanged(value.key, field) } }
                        />
                    }

                    { isBoolean &&
                        <Toggle
                            defaultChecked={ false }
                            onText='Yes'
                            offText='No'
                            value={value}
                            onChanged={ (value) => { this.onChanged(value, field) } }
                        />
                    }

                    { isString &&
                        <TextField
                            placeholder="Please fill"
                            description={field.description}
                            value={value}
                            onGetErrorMessage={(value) => this.getErrorMessage(field, value)}
                            deferredValidationTime={200}
                            disabled={fieldConfig.nouserinput}
                            onChanged={ (value) => { this.onChanged(value, field) } }
                        />
                    }

                </span>
                </div>
            )
        });

        return elements;
    };

    onSubmit = () => {
      this.props.onSubmit(this.state.formData);
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
                    onClick={this.onSubmit}
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