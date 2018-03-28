// Libs
import React, { Component } from 'react';
import withTheme from '../../withTheme';
import { CircularProgress } from 'material-ui/Progress';
import Grow from 'material-ui/transitions/Grow';
import Grid from 'material-ui/Grid';

// Components
import AppBar from '../AppBar/AppBar';
import MessageList from '../MessageList/MessageList';

// Utils
import { messagesApiEndpointTemplate } from '../../utils/APIUtils';

class App extends Component {

  defaultState = {
    loadingMessages: true,
    messageData: {},
    messageResponseErrorMsg: ''
  }

  state = {
    ...this.defaultState
  };

  fetchMessages(token) {
    return fetch(messagesApiEndpointTemplate(token), {
      method: 'GET'
    })
      .then(response => {
        return response.json().then(data => ({
          data,
          ok: response.ok
        }));
      });
  }

  handleDeleteMessage = (id) => {
    let messages = this.state.messageData.messages;
    messages = messages.filter(m => m.id !== id);
    this.setState({
      messageData: {
        ...this.state.messageData,
        messages
      }
    });
  }

  componentDidMount() {
    this.fetchMessages()
      .then(({ data, ok }) => {
        if (ok) {
          this.setState({
            loadingMessages: false,
            messageData: data
          });
        } else {
          this.setState({
            loadingMessages: false,
            messageResponseErrorMsg: data.message || 'An unknown error occured. Please try again.'
          });
        }
      })
      .catch((e) => {
        this.setState({
          loadingMessages: false,
          messageResponseErrorMsg: e
        });
      });
  }

  render() {
    return (
      <div className="App">
        <AppBar title={ "Messages" } />
        <Grow in={ this.state.loadingMessages } unmountOnExit>
          <Grid container justify="center" spacing={0} style={ { padding: '1rem' } }>
            <CircularProgress />
          </Grid>
        </Grow>
        <MessageList messages={ this.state.messageData.messages } onDeleteMessage={ this.handleDeleteMessage } />
      </div>
    );
  }

}

export default withTheme(App);
