import React from 'react';

import InputComponent from '../Shared/InputComponent';

import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import getSearchParamsFromUrl from '../../utils/getSearchParamsFromUrl';
import setHistoryURL from '../../utils/setHistoryUrlSearchValues'
import getFieldConfig from "../../utils/getFieldConfig";

class FiltersToUrlParams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            values: getSearchParamsFromUrl(this.props.history)
        };
    }

    updateFilter = () => {
        const history = this.props.history;
        const values = this.state.values;

        const searchParams = Object.keys(values)
            .reduce((acc, key) => {
                if (values[key]) {
                    acc[key] = values[key];
                }

                return acc;
            }, {});

        setHistoryURL(history, searchParams);
    };

    onValueUIChange = ({ name, value }) => {
        const newValues = Object.assign({}, this.state.values);
        newValues[name] = value;

        this.setState({ values: newValues });
    };

    render() {

        const uiElements = this.props.type.arguments
            .map((arg) => {
                const inputValue = this.state.values[arg.name] || '';
                const fieldConfig = getFieldConfig(arg);
                const serverSchema = this.props.serverSchema;

                return (
                    <li key={arg.name}>
                        <span>{arg.name}:</span>

                        <InputComponent
                            value={inputValue}
                            placeholder="Please fill"
                            description={arg.description}
                            onChanged={ (value) => this.onValueUIChange({ name: arg.name, value }) }
                            field={arg}
                            fieldConfig={fieldConfig}
                            serverSchema={serverSchema}
                        />
                    </li>
                );
            });

        return uiElements.length
            ? <div className="filterWrapper">
                    <ul className="filters">
                        {uiElements}
                    </ul>

                    <br/>

                    <DefaultButton
                        primary={true}
                        text='Update'
                        onClick={this.updateFilter}
                    />
                </div>
            : null
    }
}

export default FiltersToUrlParams;