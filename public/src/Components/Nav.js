import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
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
            <div>
                <Pivot>
                    {
                        queryTypes.map(type => {
                            const View = type.isList
                                ? getListView(type)
                                : getSingleView(type);

                            return (
                            <PivotItem key={type.name} linkText={type.name}>
                                <Label>{JSON.stringify(type)}</Label>
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