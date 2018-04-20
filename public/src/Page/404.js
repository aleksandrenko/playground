import React from 'react';
import { MessageBarType, MessageBar } from "office-ui-fabric-react/lib/MessageBar";

class Component extends React.Component {
    render() {
        return <MessageBar
            messageBarType={ MessageBarType.error }
        >
            Error 404: Page not found
        </MessageBar>;
    }
}

export default Component;