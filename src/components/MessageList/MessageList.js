// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

// Components
import Avatar from 'material-ui/Avatar';
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

const styles = {
  root: {
    padding: '1rem'
  }
};

function MessageList(props) {
  const { classes, messages } = props;
  return (
    <div className={classes.root}>
      <Card>
        <CardHeader
          avatar={
            <Avatar aria-label="Message sender" className={classes.avatar}>
              V
            </Avatar>
          }
          title="Virginia Shultz"
          subheader="12 minutes ago"
        />
        <CardContent style={ { paddingTop: 0 } }>
          <Typography component="p">
            Fusce vehicula dolor arcu, sit amet blandit dolor mollis nec. Donec viverra eleifend lacus, vitae ullamcorper metus.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

MessageList.propTypes = {
  classes: PropTypes.object.isRequired,
  messages: PropTypes.array
};

export default withStyles(styles)(MessageList);
