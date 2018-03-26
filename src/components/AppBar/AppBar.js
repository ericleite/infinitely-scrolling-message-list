// Libs
import React, { PureComponent } from 'react';
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

class AppBar extends PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  state = {
    appBarHeight: 0
  }

  componentDidMount() {
    const appBarRect = this.appBarRef.getBoundingClientRect();
    this.setState({
      appBarHeight: appBarRect.height
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const appBarRect = this.appBarRef.getBoundingClientRect();
    if (prevState.appBarHeight !== appBarRect.height) {
      this.setState({
        appBarHeight: appBarRect.height
      })
    }
  }

  render() {
    const { classes, title } = this.props;
    return (
      <div className={classes.root} style={ { height: `${this.state.appBarHeight}px` } }>
        <MuiAppBar position="fixed" color="primary">
          <div ref={ (node) => { this.appBarRef = node; } }>
            <Toolbar disableGutters>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit">
                { title }
              </Typography>
            </Toolbar>
          </div>
        </MuiAppBar>
      </div>
    );
  }
}

export default withStyles(styles)(AppBar);
