import React from 'react';

import getListViewGrid from './ListView/index';
import FiltersToUrlParams from './Shared/FiltersToUrlParams';
import getSearchParamsFromUrl from "../utils/getSearchParamsFromUrl";
import getFieldView from "./SingleItemView/index";

class View extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const type = this.props.type;
        const searchParams = getSearchParamsFromUrl(this.props.history);
        const hasRequiredArguments = type.arguments.some(arg => arg.isRequired);
        const hasProvidedArguments = Object.keys(searchParams).length;
        const View = type.isList
            ? getListViewGrid(type)
            : getFieldView(type);

        const componentToRender = (
            hasRequiredArguments
                ? (hasProvidedArguments)
                    ? <View params={searchParams} { ...this.props } />
                    : <div>Specify the required query params!</div>
                :  <View params={searchParams} { ...this.props } />
        );

        return (
            <div className="withFilter">
                <div className="header">
                    <FiltersToUrlParams { ...this.props } />
                </div>
                <div className="content">
                    { componentToRender }
                </div>
            </div>
        );
    }
}

export default (type) => (props) => (
    <View
        type={type}
        { ...props }
    />
);