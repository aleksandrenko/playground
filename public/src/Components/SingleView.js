import React from 'react';

import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import getSingleViewResults from './SingleViewResults';


class SingleFilterView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    tempValues = {};

    updateFilter = () => {
        const newState = Object.assign({}, this.tempValues);
        this.setState(newState);
    };

    onValueUIChange = (_value) => {
        const name = _value.target.name;
        const value = _value.target.value;
        this.tempValues[name] = value;
    };

    render() {
        const type = this.props.type;
        const DetailsView = this.props.detailsView;

        const uiElements = type.arguments.map((arg) => {
            return (
                <li key={arg.name}>
                    {arg.name}: <input
                        type="text"
                        name={arg.name}
                        onChange={this.onValueUIChange}
                    />
                    <div><small>{ arg.description }</small></div>

                    <br/>

                    <DefaultButton
                        primary={ true }
                        text='Update'
                        onClick={ this.updateFilter }
                    />
                </li>
            );
        });

        return (
            <div>
                <div className="withFilter">
                    <div className="header">
                        <ul>
                            { uiElements }
                        </ul>
                    </div>
                    <div className="content">
                        <DetailsView params={this.state} />
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
    />
);
