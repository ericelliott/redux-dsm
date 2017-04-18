import React from 'react';
import { connect } from 'react-redux';

const List = ({ items }) => (
    <ul>
        { items.map((item, index) => (
            <ListItem key={index}>{item.message}, {item.author}</ListItem>
        ))}
    </ul>
);


const ListItem = ({ children }) => (
    <li>{children}</li>
);

const mapStateToProps = (state) => {
    return {
        items: state.items
    }
};

export const App = connect(mapStateToProps)(List);

