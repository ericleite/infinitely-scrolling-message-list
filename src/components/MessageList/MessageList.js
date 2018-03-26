// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import moment from 'moment';

// Components
import Avatar from 'material-ui/Avatar';
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

// Utils
import { apiEndpoint } from '../../utils/APIUtils';

const GRID_SPACING = 8;
const styles = {
  root: {
    padding: '1rem'
  }
};

function MessageList(props) {
  const { classes, messages } = props;

  const messageCards = messages.map(({ id, author, content, updated }) => {
    const avatar = author.photoUrl
      ? <Avatar alt={`Photo of ${author.name}`} src={`${apiEndpoint}/${author.photoUrl}`} className={classes.avatar} />
      : <Avatar aria-label="Message sender avatar" className={classes.avatar} />

    return (
      <Grid key={ id } item>
        <Card>
          <CardHeader
            avatar={ avatar }
            title={ author.name }
            subheader={ <Typography variant="caption">{ moment(updated).fromNow() }</Typography> }
          />
          <CardContent style={ { paddingTop: 0 } }>
            <Typography>
              { content }
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  });

  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={GRID_SPACING}>
        { messageCards }
      </Grid>
    </div>
  );
}

MessageList.propTypes = {
  classes: PropTypes.object.isRequired,
  messages: PropTypes.array
};

MessageList.defaultProps = {
  classes: {},
  messages: []
};

export default withStyles(styles)(MessageList);
