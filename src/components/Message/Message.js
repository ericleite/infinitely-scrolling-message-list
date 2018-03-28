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
const EASE_IN = BezierEasing(0.4, 0, 1, 1);
const EASE_OUT = BezierEasing(0, 0, 0.2, 1);
const styles = {};

class Message extends Component {

  static propTypes = {
    // Data props
    authorName: PropTypes.string.isRequired,
    avatar: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
    id: PropTypes.number.isRequired,
    updated: PropTypes.string.isRequired,
    // Props from Draggable
    measureRef: PropTypes.func.isRequired,
    // Other props
    classes: PropTypes.object.isRequired,
    contentRect: PropTypes.object,
    onDeleteMessage: PropTypes.func.isRequired
  }

  static defaultProps = {
    classes: {}
  }

  constructor() {
    super();

    this.animationEnterDuration = 225;
    this.animationExitDuration = 195;
    this.animationStartTime = 0;
    this.animationStartX = 0;
    this.animationStartOpacity = 0;
    this.deleteThreshold = 0.5;
    this.contentLengthLimit = 160;

    this.defaultState = {
      position: {
        x: 0,
        y: 0
      },
      style: {
        opacity: 1,
        touchAction: 'pan-y'
      }
    };

    this.state = {
      animationId: null,
      contentCollapsed: true,
      dragging: false,
      position: this.defaultState.position,
      style: this.defaultState.style,
      width: -1
    };
  }

  handleClickContent = () => {
    this.setState((prevState) => ({
      contentCollapsed: !prevState.contentCollapsed
    }));
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
    this.setState((prevState) => ({
      position: {
        x: data.x,
        y: 0
      },
      style: {
        ...prevState.style,
        opacity: percentMovedX
      }
    }));
  }

  handleDragStop = (e, data) => {
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

  slideToStart = () => {
    const {
      dragging,
      position,
      animationId
    } = this.state;

    const percentComplete = EASE_OUT(
      (Date.now() - this.animationStartTime)/this.animationEnterDuration
    );

    if (!dragging) {
      if (position.x > 0) {
        this.setState((prevState) => ({
          position: {
            x: (this.animationStartX * (1 - percentComplete))|0,
            y: 0
          },
          style: {
            ...prevState.style,
            opacity: this.animationStartOpacity + (1 - this.animationStartOpacity) * percentComplete
          }
        }));
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

    const percentComplete = EASE_IN(
      (Date.now() - this.animationStartTime)/this.animationExitDuration
    );

    if (!dragging) {
      if (position.x < width) {
        this.setState((prevState) => ({
          position: {
            x: this.animationStartX + (width + 10 - this.animationStartX) * percentComplete,
            y: 0
          },
          style: {
            ...prevState.style,
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
      updated,
      // Props from Draggable
      measureRef
    } = this.props;

    let finalContent = content;
    if (
      this.state.contentCollapsed &&
      ((content.length > this.contentLengthLimit) ||
      (content.length === this.contentLengthLimit && content.charAt(content.length - 1) !== '.'))
    ) {
      finalContent = [content.substr(0, this.contentLengthLimit), <span key="ellipsis">&hellip;</span>];
    }

    return (
      <article ref={measureRef}>
        <Draggable
          axis="x"
          bounds={ { left: 0 } }
          position={ this.state.position }
          onStart={ this.handleDragStart }
          onDrag={ this.handleDrag }
          onStop={ this.handleDragStop }
        >
          <Card style={ this.state.style }>
            <CardHeader
              avatar={avatar}
              title={authorName}
              subheader={ <Typography variant="caption">{ moment(updated).fromNow() }</Typography> }
            />
            <CardContent style={ { paddingTop: 0 } }>
              <Typography onClick={ this.handleClickContent }>
                { finalContent }
              </Typography>
            </CardContent>
          </Card>
        </Draggable>
      </article>
    );
  }
}

export default withContentRect('bounds')(withStyles(styles)(Message));
