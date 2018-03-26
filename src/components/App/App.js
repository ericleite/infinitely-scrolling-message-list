// Libs
import React, { Component } from 'react';
import withTheme from '../../withTheme';

// Components
import AppBar from '../AppBar/AppBar';
import MessageList from '../MessageList/MessageList';

class App extends Component {

  render() {
    return (
      <div className="App">
        <AppBar title={ "Messages" } />
        <MessageList messages={ [] } />
      </div>
    );
  }

}

export default withTheme(App);
