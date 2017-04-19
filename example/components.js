import React from 'react';
import {connect} from 'react-redux';

const Main = ({messages, error}) => {
    if (error) {
        return <div>Error!</div>
    }

    return <List messages={messages} />
};

const List = ({messages}) => (
    <ul>
        { messages.map((message, index) => (
            <ListItem key={index}>{message.text}, {message.author}</ListItem>
        ))}
    </ul>
);


const ListItem = ({children}) => (
    <li>{children}</li>
);

const mapStateToProps = (state) => {
    const {payload: {messages = [], error} = {}} = state;

    return {
        messages,
        error
    }
};

export const App = connect(mapStateToProps)(Main);

