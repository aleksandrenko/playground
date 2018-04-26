
import * as React from 'react';
import {
    DetailsList,
    DetailsListLayoutMode,
    CheckboxVisibility
} from 'office-ui-fabric-react/lib/DetailsList';


export default class DetailsListComponent extends React.Component {
    render() {
        const { columns, items } = this.props;

        return (
            <div>
                <DetailsList
                    items={ items }
                    columns={ columns }
                    setKey='set'
                    layoutMode={ DetailsListLayoutMode.justified }
                    isHeaderVisible={ true }
                    onItemInvoked={ this.props.onColumnClick }
                    checkboxVisibility={CheckboxVisibility.hidden}
                />
            </div>
        );
    }
}