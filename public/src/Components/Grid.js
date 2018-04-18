
import * as React from 'react';

import { TextField } from 'office-ui-fabric-react/lib/TextField';
import {
    DetailsList,
    DetailsListLayoutMode,
    Selection,
    SelectionMode
} from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';


export default class DetailsListComponent extends React.Component {
    _selection;

    constructor(props) {
        super(props);

        this._selection = new Selection({
            onSelectionChanged: () => {
                this.setState({
                    selectionDetails: this._getSelectionDetails()
                });
            }
        });

        this.state = {
            selectionDetails: this._getSelectionDetails()
        };
    }

    render() {
        const { selectionDetails } = this.state;
        const { columns, items } = this.props;

        return (
            <div>
                <div>{ selectionDetails }</div>
                <TextField
                    label='Filter by name:'
                    onChanged={ this._onChangeText }
                />
                <MarqueeSelection selection={ this._selection }>
                    <DetailsList
                        items={ items }
                        columns={ columns }
                        selectionMode={ SelectionMode.multiple }
                        setKey='set'
                        layoutMode={ DetailsListLayoutMode.justified }
                        isHeaderVisible={ true }
                        selection={ this._selection }
                        selectionPreservedOnEmptyClick={ true }
                        onItemInvoked={ this._onItemInvoked }
                        enterModalSelectionOnTouch={ true }
                    />
                </MarqueeSelection>
            </div>
        );
    }

    _onChangeText = (text) => {
        const { _items } = this.props;
        this.setState({ items: text ? _items.filter(i => i.name.toLowerCase().indexOf(text) > -1) : _items });
    };

    _onItemInvoked(item) {
        alert(`Item invoked: ${item.name}`);
    }

    _getSelectionDetails() {
        const selectionCount = this._selection.getSelectedCount();

        switch (selectionCount) {
            case 0:
                return 'No items selected';
            case 1:
                return '1 item selected: ' + (this._selection.getSelection()[0]).name;
            default:
                return `${selectionCount} items selected`;
        }
    }

    _sortItems = (items, sortBy, descending = false) => {
        if (descending) {
            return items.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) {
                    return 1;
                }
                if (a[sortBy] > b[sortBy]) {
                    return -1;
                }
                return 0;
            });
        } else {
            return items.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) {
                    return -1;
                }
                if (a[sortBy] > b[sortBy]) {
                    return 1;
                }
                return 0;
            });
        }
    }
}