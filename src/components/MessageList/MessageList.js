// Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

// Components
import Avatar from 'material-ui/Avatar';
import Grid from 'material-ui/Grid';
import Message from '../Message/Message';

// Utils
import { apiEndpoint } from '../../utils/APIUtils';

const styles = {
  root: {
    padding: '0.75rem',
    overflowX: 'hidden'
  }
};

class MessageList extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    messages: PropTypes.array,
    onDeleteMessage: PropTypes.func
  }

  static defaultProps = {
    classes: {},
    messages: []
  }

  handleTouchMove = (e) => {
    // TODO: Allow scroll when vertical touch event happens on a message.
    // console.log('moved', e.targetTouches[0].clientX);
  }

  render() {
    const { classes, messages, onDeleteMessage } = this.props;

    const messageCards = messages.map(({ id, author, content, updated }) => {
      const avatar = author.photoUrl
        ? <Avatar alt={`Photo of ${author.name}`} src={`${apiEndpoint}/${author.photoUrl}`} className={classes.avatar} />
        : <Avatar aria-label="Message sender avatar" className={classes.avatar} />

      return (
        <Grid key={ id } item>
          <Message
            avatar={ avatar }
            authorName={ author.name }
            content={ content }
            id={ id }
            updated={ updated }
            onDeleteMessage={ onDeleteMessage }
          />
        </Grid>
      );
    });

    return (
      <div className={classes.root} onTouchMove={ this.handleTouchMove }>
        <Grid container direction="column" spacing={8}>
          { messageCards }
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(MessageList);
