// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

// Components
import { default as MuiAppBar } from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import MenuIcon from 'material-ui-icons/Menu';

const styles = {
  menuButton: {
    marginRight: '1rem'
  }
};

function AppBar(props) {
  const { classes, title } = props;
  return (
    <div className={classes.root}>
      <MuiAppBar position="fixed" color="primary">
        <Toolbar disableGutters>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit">
            { title }
          </Typography>
        </Toolbar>
      </MuiAppBar>
    </div>
  );
}

AppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppBar);
