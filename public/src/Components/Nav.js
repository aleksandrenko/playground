import * as React from 'react';
import {
    PivotItem,
    Pivot
} from 'office-ui-fabric-react/lib/Pivot';

import getListView from './ListView';
import getSingleView from './SingleView';

export default class PivotIcon extends React.Component {
    render() {

        const navs = this.props.nav || [];
        const queryTypes = navs.queryTypes || [];

        return (
            <div className="tabs">
                <Pivot>
                    {
                        queryTypes.map(type => {
                            const View = type.isList
                                ? getListView(type)
                                : getSingleView(type);

                            return (
                            <PivotItem key={type.name} linkText={type.name}>
                                <View />
                            </PivotItem>
                            );
                        })
                    };
                </Pivot>
            </div>
        );
    }
}