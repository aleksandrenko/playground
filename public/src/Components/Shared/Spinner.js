import * as React from 'react';
import {
    Spinner,
    SpinnerSize
} from 'office-ui-fabric-react/lib/Spinner';

export default class SpinnerComponent extends React.Component {
    render() {
        return (
           <Spinner size={ SpinnerSize.large } label={this.props.label} ariaLive='assertive' />
        );
    }
}