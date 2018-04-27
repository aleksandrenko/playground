import React from 'react';

import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import getSearchParamsFromUrl from '../utils/getSearchParamsFromUrl';
import setHistoryURL from '../utils/setHistoryUrlSearchValues'

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

    onValueUIChange = (_value) => {
        const name = _value.target.name;
        const value = _value.target.value;

        const newValues = Object.assign({}, this.state.values);
        newValues[name] = value;

        this.setState({ values: newValues });
    };

    render() {

        const uiElements = this.props.type.arguments
            .map((arg) => {
                const inputValue = this.state.values[arg.name] || '';

                return (
                    <li key={arg.name}>
                        <span>{arg.name}:</span>
                        <input
                            type="text"
                            name={arg.name}
                            onChange={this.onValueUIChange}
                            value={inputValue}
                        />
                        <div><small>{ arg.description }</small></div>
                    </li>
                );
            });

        return (
            <div className="filterWrapper">
                <ul className="filters">
                    { uiElements }
                </ul>

                <br/>

                <DefaultButton
                    primary={ true }
                    text='Update'
                    onClick={ this.updateFilter }
                />
            </div>
        );

    }
}

export default FiltersToUrlParams;