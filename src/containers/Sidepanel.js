import React from 'react';
import Icon from '@ant-design/icons';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import * as authActions from '../store/actions/auth';
import * as navActions from '../store/actions/nav';
import * as messageActions from '../store/actions/message';
import Contact from '../components/Contact';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class Sidepanel extends React.Component {

    state = {
        loginForm: true
    }

    waitForAuthDetails() {
        const component = this;
        setTimeout(function() {
            if (
                // Checking if our component.props.token is not null
                // and it's not undefined, then we're going to call
                // the getUserChats method from redux which is one of the
                // React Module.
                component.props.token !== null &&
                component.props.token !== undefined
            ) {
                component.props.getUserChats(
                    component.props.username,
                    component.props.token
                );
                return;
            } else {
              console.log("waiting for authentication details...");
              // Otherwise, recirculate waitForAuthDetails Method again.
              component.waitForAuthDetails();
            }
        }, 100);
    }

    componentDidMount(){
        // Call waitForAuthDetails Method.
        this.waitForAuthDetails();
    }

    openAddChatPopup() {
        this.props.addChat();
    }

    changeForm = () => {
        this.setState({ loginForm: !this.state.loginForm });
    };

    authenticate = (e) => {
        e.preventDefault();
        if (this.state.loginForm) {
            this.props.login(
                e.target.username.value,
                e.target.password.value
            );
            console.log(e.target.username.value);
            console.log(e.target.password.value);
        } else {
            this.props.signup(
                e.target.username.value,
                e.target.email.value,
                e.target.password.value,
                e.target.password2.value
            );
        }
    }

    render() {
        let activeChats = this.props.chats.map(c => {
//        const activeChats = this.state.chats.map(c => {
            return (
                <Contact
                    key={c.id}
                    name="Harvey Specter"
                    picURL="http://emilcarlsson.se/assets/louislitt.png"
                    status="busy"
                    chatURL={`/${c.id}`} />
            )
        });
        return (
            <div id="sidepanel">
                <div id="profile">
                    <div className="wrap">
                        <img id="profile-img" src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt="" />
                        <p>Mike Ross</p>
                        <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
                        <div id="status-options">
                            <ul>
                            <li id="status-online" className="active"><span className="status-circle"></span> <p>Online</p></li>
                            <li id="status-away"><span className="status-circle"></span> <p>Away</p></li>
                            <li id="status-busy"><span className="status-circle"></span> <p>Busy</p></li>
                            <li id="status-offline"><span className="status-circle"></span> <p>Offline</p></li>
                            </ul>
                        </div>
                        <div id="expanded">
                            {this.props.loading ? (
                            <Spin indicator={antIcon} /> ) : this.props.isAuthenticated ? (
                            <button onClick={() => this.props.logout()} className="authBtn">
                                <span>Logout</span>
                            </button>
                        ) : (
                <div>
                  <form method="POST" onSubmit={this.authenticate}>
                    {
                        this.state.loginForm ? (

                        <div>
                            <input name="username" type="text" placeholder="username" />
                            <input name="password" type="password" placeholder="password" />
                        </div>

                       ) : (

                        <div>
                            <input name="username" type="text" placeholder="username" />
                            <input name="email" type="email" placeholder="email" />
                            <input name="password" type="password" placeholder="password" />
                            <input name="password2" type="password" placeholder="password confirm" />
                        </div>
                    )}
                    <button type="submit">Authenticate</button>
                  </form>

                  <button onClick={this.changeForm}>Switch</button>
                </div>
                )}
                </div>
                </div>
            </div>
            <div id="search">
                <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                <input type="text" placeholder="Search contacts..." />
            </div>
            <div id="contacts">
                <ul>
                    {activeChats}

                </ul>
            </div>
            <div id="bottom-bar">
                <button id="addcontact" onClick={() => this.openAddChatPopup()}>
                    <i className="fa fa-user-plus fa-fw" aria-hidden="true"></i>
                    <span>Add Chat</span>
                </button>
                <button id="settings">
                    <i className="fa fa-cog fa-fw" aria-hidden="true"></i>
                    <span>Settings</span>
                </button>
            </div>
            </div>
            );
        };
    }

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        loading: state.auth.loading,
        token: state.auth.token,
        username: state.auth.username,
        // Show users messages that they sent.
        chats: state.message.chats
    };
}

const mapDispatchToProps = dispatch => {
    return {
        login: (userName, password) => dispatch(authActions.authLogin(userName, password)),
        logout: () => dispatch(authActions.logout()),
        signup: (username, email, password1, password2) => dispatch(authActions.authSignup(username, email, password1, password2)),
        addChat: () => dispatch(navActions.openAddChatPopup()),
        getUserChats: (username, token) => dispatch(messageActions.getUserChats(username, token))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidepanel);
