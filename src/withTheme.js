//Libs
import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import CssBaseline from 'material-ui/CssBaseline';
import deepPurple from 'material-ui/colors/deepPurple';
import grey from 'material-ui/colors/grey';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: deepPurple[300],
      main: deepPurple[500],
      dark: deepPurple[700]
    },
    background: {
      default: grey[200]
    }
  },
  typography: {
    fontSize: 16
  },
  zIndex: {
    progressIndicator: 1050
  }
});

function withTheme(Component) {
  function WithTheme(props) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Component theme={theme} {...props} />
      </MuiThemeProvider>
    );
  }

  return WithTheme;
}

export default withTheme;
