
import React from 'react';
import getFieldConfig from "../utils/getFieldConfig";
import antValidation from "antvalidation";

// https://www.apollographql.com/docs/react/essentials/mutations.html

// import Spinner from './Spinner';
// import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
// import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
// import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
// import { Dropdown, DropdownMenuItemType } from 'office-ui-fabric-react/lib/Dropdown';
// import { Slider } from 'office-ui-fabric-react/lib/Slider';

import { TextField } from 'office-ui-fabric-react/lib/TextField';


const getErrorMessage = (field, value) => {
    value =  value + ''; //only strings can be validated

    const ants = field.description || '';
    const errors = antValidation({ants, value});
    return errors.join('\n');
};

const getFieldsFromArguments = (_args, formData) => {
    const elements = _args.map(field => {
        const fieldConfig = getFieldConfig(field);
        const defaultValue = fieldConfig.default !== undefined ? fieldConfig.default : '';
        const NoUI = fieldConfig.noui;

        return (!NoUI &&
            <div className="row" key={`field_${field.name}`}>
                <label className="label">{field.name}: </label>
                <span className="value">
                    <TextField
                        placeholder="Please fill"
                        description={field.description}
                        value={defaultValue}
                        onGetErrorMessage={ (value) => getErrorMessage(field, value) }
                        deferredValidationTime={400}
                        disabled={fieldConfig.nouserinput}
                        onChanged={ (value) => { formData[field.name] = value } }
                    />
                </span>
            </div>
        )
    });

    return elements;
};

class FieldFormFields extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { type, formData } = this.props;
        const uiFields = getFieldsFromArguments(type.arguments, formData);

        return (
            <div className="field">
                { uiFields }
            </div>
        );
    }
}

export default FieldFormFields;