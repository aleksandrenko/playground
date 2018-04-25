import React from 'react';

import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import getSingleViewResults from './SingleViewResults';

const getSearchParamsFromUrl = (history) => {
    return history.location.search
        .replace('?', '')
        .split('&')
        .reduce((acc, param) => {
            const parts = param.split('=');
            parts[0] && (acc[parts[0]] = parts[1]);

            return acc;
        }, {});
};

const setHistoryURL = (history, searchValues) => {
    const searchParamsString = '?' + Object.keys(searchValues)
        .map(key => `${key}=${searchValues[key]}`)
        .join('&');

    const newLocation = history.location.pathname + searchParamsString;
    history.push(newLocation);
};

class SingleFilterView extends React.Component {

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
        const DetailsView = this.props.detailsView;
        const searchParams = getSearchParamsFromUrl(this.props.history);

        const uiElements = this.props.type.arguments.map((arg) => {
            const inputValue = this.state.values[arg.name] || '';

            return (
                <li key={arg.name}>
                    {arg.name}:
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
            <div>
                <div className="withFilter">
                    <div className="header">
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
                    <div className="content">
                        { Object.keys(searchParams).length
                            ? <DetailsView params={searchParams} />
                            : <div>Enter input value.</div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}


export default (type) => (props) => (
    <SingleFilterView
        type={type}
        detailsView={getSingleViewResults(type)}
        { ...props }
    />
);
