import React from 'react';

import getFieldView from './FieldView';
import FiltersToUrlParams from './FiltersToUrlParams';
import getSearchParamsFromUrl from '../utils/getSearchParamsFromUrl';

class SingleFilterView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            values: getSearchParamsFromUrl(this.props.history)
        };
    }

    render() {
        const FieldView = getFieldView(this.props.type);
        const searchParams = getSearchParamsFromUrl(this.props.history);

        return (
            <div className="withFilter">
                <div className="header">
                    <FiltersToUrlParams { ...this.props } />
                </div>
                <div className="content">
                    { Object.keys(searchParams).length
                        ? <FieldView params={searchParams} />
                        : <div>Enter input value.</div>
                    }
                </div>
            </div>
        );
    }
}


export default (type) => (props) => (
    <SingleFilterView
        type={type}
        { ...props }
    />
);
