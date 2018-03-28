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
    ariaBusy: PropTypes.string.isRequired,
    ariaDescribedby: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    getMessageListRef: PropTypes.func,
    messages: PropTypes.array,
    onDeleteMessage: PropTypes.func
  }

  static defaultProps = {
    classes: {},
    messages: []
  }

  render() {
    const {
      ariaBusy,
      ariaDescribedby,
      classes,
      getMessageListRef,
      messages,
      onDeleteMessage
    } = this.props;

    const messageCards = messages.map(({ id, author, content, updated }) => {
      const avatar = author.photoUrl
        ? <Avatar alt={`Photo of ${author.name}`} src={`${apiEndpoint}/${author.photoUrl}`} className={classes.avatar} />
        : <Avatar aria-label="Message sender avatar" className={classes.avatar}>{author.name.charAt()}</Avatar>

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
      <section
        aria-busy={ ariaBusy }
        aria-describedby={ ariaDescribedby }
        className={classes.root}
        ref={ (node) => { getMessageListRef && getMessageListRef(node); } }
      >
        <Grid container direction="column" spacing={8}>
          { messageCards }
        </Grid>
      </section>
    );
  }
}

export default withStyles(styles)(MessageList);
