// Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import moment from 'moment';
import Draggable from 'react-draggable';
import { withContentRect } from 'react-measure';
import BezierEasing from 'bezier-easing';

// Components
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

// Constants
const EASE_OUT = BezierEasing(0, 0, 0.58, 1);
const styles = {
  root: {},
  card: {}
};

class Message extends Component {

  static propTypes = {
    // Data props
    authorName: PropTypes.string.isRequired,
    avatar: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
    id: PropTypes.number.isRequired,
    updated: PropTypes.string.isRequired,
    // Other props
    classes: PropTypes.object.isRequired,
    contentRect: PropTypes.object,
    measureRef: PropTypes.func,
    onDeleteMessage: PropTypes.func.isRequired
  }

  static defaultProps = {
    classes: {}
  }

  constructor() {
    super();

    this.animationDuration = 200;
    this.animationStartTime = 0;
    this.animationStartX = 0;
    this.animationStartOpacity = 0;
    this.deleteThreshold = 0.5;

    this.defaultState = {
      position: {
        x: 0,
        y: 0
      },
      style: {
        opacity: 1
      }
    };

    this.state = {
      animationId: null,
      dragging: false,
      position: this.defaultState.position,
      style: this.defaultState.style,
      width: -1
    };
  }

  slideToStart = () => {
    const {
      dragging,
      position,
      animationId
    } = this.state;

    const percentComplete = EASE_OUT(
      (Date.now() - this.animationStartTime)/this.animationDuration
    );

    if (!dragging) {
      if (position.x > 0) {
        this.setState({
          position: {
            x: (this.animationStartX * (1 - percentComplete))|0,
            y: 0
          },
          style: {
            opacity: this.animationStartOpacity + (1 - this.animationStartOpacity) * percentComplete
          }
        });
        requestAnimationFrame(this.slideToStart);
      } else {
        cancelAnimationFrame(animationId);
        this.setState({
          position: this.defaultState.position,
          style: this.defaultState.style
        });
      }
    }
  }

  slideOffScreen = () => {
    const {
      animationId,
      dragging,
      position,
      width
    } = this.state;

    const percentComplete = EASE_OUT(
      (Date.now() - this.animationStartTime)/this.animationDuration
    );

    if (!dragging) {
      if (position.x < width) {
        this.setState((prevState) => ({
          position: {
            x: this.animationStartX + (width + 10 - this.animationStartX) * percentComplete,
            y: 0
          },
          style: {
            opacity: this.animationStartOpacity * (1 - percentComplete)
          }
        }));
        requestAnimationFrame(this.slideOffScreen);
      } else {
        cancelAnimationFrame(animationId);
        this.props.onDeleteMessage(this.props.id);
      }
    }
  }

  handleDragStart = (e, data) => {
    if (this.state.animationId !== null) {
      cancelAnimationFrame(this.state.animationId);
    }
    this.setState({
      dragging: true
    });
  }

  handleDrag = (e, data) => {
    let percentMovedX = 1 - (data.x/this.state.width);
    if (percentMovedX < 0) {
      percentMovedX = 0;
    }
    this.setState({
      position: {
        x: data.x,
        y: 0
      },
      style: {
        opacity: percentMovedX
      }
    });
  }

  handleDragStop = id => (e, data) => {
    this.setState({
      dragging: false
    });
    this.animationStartX = data.x;
    this.animationStartOpacity = this.state.style.opacity;
    this.animationStartTime = Date.now();
    if (data.x > this.state.width * this.deleteThreshold) {
      this.setState({
        animationId: requestAnimationFrame(this.slideOffScreen)
      });
    } else {
      this.setState({
        animationId: requestAnimationFrame(this.slideToStart)
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.contentRect &&
      this.props.contentRect.bounds &&
      nextProps.contentRect &&
      nextProps.contentRect.bounds &&
      this.props.contentRect.bounds.width !== nextProps.contentRect.bounds.width
    ) {
      this.setState({
        width: nextProps.contentRect.bounds.width
      });
    }
  }

  render() {
    const {
      // Data props
      authorName,
      avatar,
      content,
      id,
      updated,
      // Other props
      classes,
      measureRef
    } = this.props;

    return (
      <div className={classes.root} ref={measureRef}>
        <Draggable
          axis="x"
          bounds={ { left: 0 } }
          position={ this.state.position }
          onStart={ this.handleDragStart }
          onDrag={ this.handleDrag }
          onStop={ this.handleDragStop(id) }
        >
          <Card className={classes.card} style={ this.state.style }>
            <CardHeader
              avatar={avatar}
              title={authorName}
              subheader={ <Typography variant="caption">{ moment(updated).fromNow() }</Typography> }
            />
            <CardContent style={ { paddingTop: 0 } }>
              <Typography>
                { content }
              </Typography>
            </CardContent>
          </Card>
        </Draggable>
      </div>
    );
  }
}

export default withContentRect('bounds')(withStyles(styles)(Message));
