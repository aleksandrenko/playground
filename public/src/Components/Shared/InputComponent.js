import * as React from 'react';

import {TextField} from 'office-ui-fabric-react/lib/TextField';

import {Dropdown} from 'office-ui-fabric-react/lib/Dropdown';
import {Toggle} from 'office-ui-fabric-react/lib/Toggle';
import { SpinButton } from 'office-ui-fabric-react/lib/SpinButton';

import antValidation from "antvalidation";

class InputComponent extends React.Component {

    getErrorMessage = (field, value) => {
        value = value + ''; //only strings can be validated

        const ants = field.description || '';
        const errors = antValidation({ants, value});

        return errors.join('\n');
    };

    render() {
        const {field, fieldConfig, onChanged, value, serverSchema} = this.props;

        const inputType = field.type;

        const isString = inputType === 'String';
        const isBoolean = inputType === 'Boolean';
        const isInt = inputType === 'Int';

        console.log('inputType', inputType, value, typeof value);

        const enums = serverSchema.enums;
        const usedEnum = enums.filter(_enum => Object.keys(_enum)[0] === inputType)[0];
        const isUIDropDown = !!usedEnum;
        const enumValues = Object.values(usedEnum || {})[0];
        const dropDownOptions = enumValues && enumValues.map(val => ({
            key: val,
            text: val
        }));

        const inputComponent = (
            isUIDropDown &&
            <Dropdown
                placeHolder={`Select an ${field.name}.`}
                options={dropDownOptions}
                value={value}
                onChanged={(value) => {
                    onChanged(value.key, field)
                }}
            />
            || isBoolean &&
            <Toggle
                defaultChecked={false}
                onText='Yes'
                offText='No'
                checked={value}
                onChanged={(value) => {
                    onChanged(value, field)
                }}
            />
            || isString &&
            <TextField
                placeholder="Please fill"
                description={field.description}
                value={value}
                onGetErrorMessage={(value) => this.getErrorMessage(field, value)}
                deferredValidationTime={200}
                disabled={fieldConfig.nouserinput}
                onChanged={(value) => {
                    onChanged(value, field)
                }}
            />
            || isInt &&
            <TextField
                placeholder="Please fill"
                description={field.description}
                value={value}
                onGetErrorMessage={(value) => this.getErrorMessage(field, value)}
                deferredValidationTime={200}
                disabled={fieldConfig.nouserinput}
                onChanged={(value) => {
                    onChanged(value, field)
                }}
            />
            ||
            <TextField
                placeholder="Please fill"
                description={field.description}
                value={value}
                onGetErrorMessage={(value) => this.getErrorMessage(field, value)}
                deferredValidationTime={200}
                disabled={fieldConfig.nouserinput}
                onChanged={(value) => {
                    onChanged(value, field)
                }}
            />
        );

        return (
            <span className="value">
                { inputComponent }
            </span>
        );
    }
}

export default InputComponent;
