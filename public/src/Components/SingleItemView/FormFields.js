import React from 'react';

import getFieldConfig from "../../utils/getFieldConfig";

import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import InputComponent from '../Shared/InputComponent';

// https://www.apollographql.com/docs/react/essentials/mutations.html

class FormFields extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: this.props.formData,
            errors: {}
        }
    }

    onChanged = (value, field) => {
        const formData = Object.assign({}, this.state.formData);

        formData[field.name] = value;

        this.setState({
            formData
        });
    };

    getFieldsFromArguments = (_args, formData) => {
        const serverSchema = this.props.serverSchema;

        const elements = _args
            .map(field => {
                const fieldConfig = getFieldConfig(field);

                const value = formData[field.name] !== undefined
                    ? formData[field.name]
                    : (fieldConfig.default !== undefined ? fieldConfig.default : '');

                const NoUI = fieldConfig.noui;

                return (!NoUI &&
                    <div className="row" key={`field_${field.name}`}>
                        <label className="label">{field.name}: </label>
                        <InputComponent
                            value={value}
                            onChanged={this.onChanged}
                            field={field}
                            fieldConfig={fieldConfig}
                            serverSchema={serverSchema}
                        />
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