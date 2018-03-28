// Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withTheme from '../../withTheme';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import Grow from 'material-ui/transitions/Grow';

// Components
import AppBar from '../AppBar/AppBar';
import MessageList from '../MessageList/MessageList';

// Utils
import { messagesApiEndpointTemplate } from '../../utils/APIUtils';

// Constants
const styles = theme => ({
  initialContentLoader: {
    position: 'absolute',
    top: '50%',
    left: 0,
    zIndex: theme.zIndex.progressIndicator
  },
  contentLoader: {
    padding: '8px',
    paddingTop: '0'
  }
});

class App extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
  }

  defaultState = {
    getNextMessages: false,
    loadingInitialContent: true,
    loadingMessages: false,
    messages: [],
    pageToken: null,
    responseErrorMsg: ''
  }

  messageListRef = null

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

  getMessageListRef = (node) => {
    this.messageListRef = node;
  }

  handleDeleteMessage = (id) => {
    this.setState({
      messages: this.state.messages.filter(m => m.id !== id)
    });
    this.handleScroll();
  }

  handleScroll = (e) => {
    if (this.messageListRef && !this.state.getNextMessages) {
      const messageListHeight = this.messageListRef.getBoundingClientRect().height;
      if (window.scrollY >  messageListHeight - 2 * window.innerHeight) {
        this.setState({
          getNextMessages: true,
          loadingMessages: true
        });
      }
    }
  }

  componentDidMount() {
    // Add scroll listener for infinite scroll.
    window.addEventListener('scroll', this.handleScroll);

    // Check scroll position on mount.
    this.fetchMessages(this.state.pageToken)
      .then(({ data, ok }) => {
        if (ok) {
          this.setState((prevState) => ({
            loadingInitialContent: false,
            messages: prevState.messages.concat(data.messages),
            pageToken: data.pageToken
          }));
        } else {
          this.setState({
            loadingInitialContent: false,
            responseErrorMsg: 'Can\'t load messages.'
          });
        }
      })
      .catch((e) => {
        this.setState({
          loadingInitialContent: false,
          responseErrorMsg: e
        });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.getNextMessages !== this.state.getNextMessages && this.state.getNextMessages) {
      // Fetch next list of messages.
      this.fetchMessages(this.state.pageToken)
        .then(({ data, ok }) => {
          if (ok) {
            this.setState((prevState) => ({
              getNextMessages: false,
              loadingMessages: false,
              messages: prevState.messages.concat(data.messages),
              pageToken: data.pageToken
            }));
          } else {
            this.setState({
              getNextMessages: false,
              loadingMessages: false,
              responseErrorMsg: 'Can\'t load messages.'
            });
          }
        })
        .catch((e) => {
          this.setState({
            getNextMessages: false,
            loadingMessages: false,
            responseErrorMsg: e
          });
        });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { classes } = this.props;
    let loaderClassName = 'contentLoader';
    let isLoading = this.state.loadingInitialContent || this.state.loadingMessages;
    if (this.state.loadingInitialContent) {
      loaderClassName = 'initialContentLoader';
    }

    return (
      <div className="App">
        <AppBar title={ "Messages" } />
        <MessageList
          ariaDescribedby="messageListLoader"
          ariaBusy={ isLoading ? 'true' : 'false' }
          getMessageListRef={ this.getMessageListRef }
          messages={ this.state.messages }
          onDeleteMessage={ this.handleDeleteMessage }
        />
        <Grow
          in={ isLoading }
          timeout={ {
            enter: 225,
            exit: 195
          } }
          unmountOnExit
        >
          <Grid id="messageListLoader" className={classes[loaderClassName]} container justify="center" spacing={0}>
            <CircularProgress size={32} />
          </Grid>
        </Grow>
      </div>
    );
  }

}

export default withTheme(withStyles(styles)(App));
