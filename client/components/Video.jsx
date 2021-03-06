import React, { Component } from 'react';
import style from '../styles.js';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/index.jsx';
import ChatContainer from './ChatContainer.jsx';
import InfoBox from '../components/InfoBox.jsx';
import EZRTC from '../lib/webRTC';
import io from 'socket.io-client';
import Whiteboard from '../components/Whiteboard.jsx';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import urlUtil from '../utils/urlHelper.jsx';

class Video extends Component {

  constructor(props) {
    super(props);

    this.state = {
      socket: props.socket,
      user: localStorage.firstName + ' ' + localStorage.lastName[0],
      roomId: urlUtil.deslugify(window.location.pathname.slice(1)),
      room: urlUtil.deslugify(window.location.pathname.slice(window.location.pathname.lastIndexOf('/') + 1)),
      host: window.location.pathname.slice(1, window.location.pathname.lastIndexOf('/')),
    };

    var context = this;

    this.state.socket.on('failure', function () {
      console.log(arguments);

      context.state.socket.disconnect();

      if (window.checkForHelp) {
        clearInterval(window.checkForHelp);

        if (parentStream) {
          parentStream.getTracks().forEach(function (track) {
            track.stop();
          });
        }
      }

      setTimeout(function () {
        browserHistory.push('/nostream');
      }, 1000);

    });
  }

  componentWillMount() {
    localStorage.username = this.props.username || localStorage.username;

    EZRTC(this.state.roomId, localStorage.username, this.state.socket, browserHistory);
  }

  componentWillUnmount() {
    if (window.checkForHelp) {
      clearInterval(window.checkForHelp);
    }
    
    if (window.parentStream) {
      window.parentStream.getTracks().forEach(function (track) {
        track.stop();
      });
    }

    if (window.ownStream) {
      window.ownStream.getTracks().forEach(function (track) {
        track.stop();
      });
    }

    this.state.socket.disconnect();
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
            <div className='row' id='putVidsHere'>
              <div 
                className='col s12 m9'
                style={{position: 'relative'}}>
                <video
                  style={{'maxHeight': window.innerHeight * .60 + 'px',
                          'maxWidth': '95%',
                          display: 'inline',
                          'zIndex': 1,
                          position: 'absolute'}}
                  controls
                  className='responsive-video' 
                  id='remoteVideo'
                  poster="/static/video.jpg" 
                  autoPlay>
                </video>
                <video
                  style={{'maxWidth': window.innerWidth * .10 + 'px', 
                          display: 'inline', 
                          'minWidth': '5%',
                          float: 'left',
                          'zIndex': 10,
                          position: 'absolute'}}
                  className='responsive-video' 
                  id='localVideo'
                  poster="/static/video.jpg"
                  autoPlay>
                </video>
              </div>
              <InfoBox 
                style={{float: 'right'}}
                className='col s12 m3'
                video={ this.props.video } 
                creatorName={ this.props.creatorName } 
                subscriptions={ this.props.subscriptions }
                addSubscription={ this.props.addSubscription }
                removeSubscription={ this.props.removeSubscription}
              />
            </div>  
        </div>
        <div className='row'>
          <div className='col s12 m9'>
              <ChatContainer 
                roomId={ this.state.roomId }
                room={ this.state.room }
                user={ this.state.user }
                socket={ this.state.socket } 
              />
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    subscriptions: state.subscriptions.data.map(s=>s.title),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, Actions)(Video);