import React from 'react';
import { connect } from 'react-redux';
//import Sidepanel from './Sidepanel/Sidepanel';
import WebSocketInstance from '../websocket';
import Hoc from '../hoc/hoc';


class Chat extends React.Component {
    // state = {}
    state = { messages: [] };
    initialiseChat() {
        this.waitForSocketConnection(() => {
            // First one is the message callbacks.
            // Second callback is the new message callback.
            // So now added the callback methods to take place
            // on those commands that will receive
            /*WebSocketInstance.addCallbacks(
                this.setMessages.bind(this),
                this.addMessage.bind(this));*/

            // Add WebSocket instance fetch messages and pass thus dot props
            // that current user which won't be working for now.
            // but It wil get to it eventually so that is the constructor.

            // Calling fetchMessage commands which is passed in the props.username.
            // To user chatID, add another argument into this method and this is going to be chatID.
            WebSocketInstance.fetchMessages(
                this.props.username,
                this.props.match.params.chatID
            );
        });

        // Call Connect Method.
        WebSocketInstance.connect(this.props.match.params.chatID);
    }
    constructor(props){
        // Make it WebSocketInstance work when import
        super(props);
        this.initialiseChat();
    }

    componentWillReceiveProps(newProps){
        console.log(newProps);
        // If the props are updating but it's not a change that involves
        // us navigating to a new chat then we don't want to actually call
        // anything inside here.

        // We only want to update the connection if we're moving to a new chat.
        // So basically checking did the parameter chatId in the URL meaning this /1
        // /2 /3 did change and if it did then we will disconnect and move to a new chat.
        if(this.props.match.params.chatID !== newProps.match.params.chatID){
            WebSocketInstance.disconnect();
            this.waitForSocketConnection(() => {
                WebSocketInstance.fetchMessages(
                    this.props.username,
                    newProps.match.params.chatID
                );
            });

            WebSocketInstance.connect(newProps.match.params.chatID);
        }
    }

    // It has Timeout function, and Chat.js importing this function.
    // Basically ensure that we wait for the connection to be steady.
    // Call this the wait for socket connection method.
    waitForSocketConnection(callback){
        const component = this; // 'this' meaning 'Chat' class
        // const recursion = this.waitForSocketConnection;
        // It can maintain connected conditions.
        setTimeout(
            // Set Times by seconds milliseconds.
            function(){
            if (WebSocketInstance.state() === 1){
                console.log('connection is secure');
                // if didn't pass in a callback,
                // then call the callback.
                callback();
                // Otherwise will just return.
                return;
            } else {
                console.log('waiting for connection...');
                component.waitForSocketConnection(callback);
            }
            // Waiting for socket connection for 100 m/s.
        }, 100);
    }

    messageChangeHandler = event => {
        this.setState({
            message: event.target.value
        });
    }

    sendMessageHandler = e => {
        e.preventDefault();
        const messageObject = {
            from: this.props.username,
            content: this.state.message,
            chatId: this.props.match.params.chatID
        };
        WebSocketInstance.newChatMessage(messageObject);
        this.setState({
            message: []
        })
    }

    renderTimestamp = timestamp => {
        let prefix = '';
        const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000);
        if (timeDiff < 1){ // less than one minutes ago
            prefix = 'just now...';
        } else if(timeDiff < 60 && timeDiff > 1){ // less than sixty minuts ago
            prefix = `${timeDiff} minutes ago`;
        } else if(timeDiff < 24*60 && timeDiff > 60){ // less than 24 hours ago
            prefix = `${Math.round(timeDiff/60)} hours ago`;
        } else if(timeDiff < 31*24*60 && timeDiff > 24*60){ // less than 7 days ago
            prefix = `${Math.round(timeDiff/(60*24))} days ago`;
        } else{
            prefix = `${new Date(timestamp)}`;
        }
        return prefix;
    }

    // Render Created Messages.
    renderMessages = messages => {
        const currentUser = this.props.username;
        return messages.map((message, i, arr) => (
            <li
                // Connect to 'id''consumer.py'
                key={message.id}
                style={{ marginBottom: arr.length - 1 === i ? "300px" : "15px" }}
                // Check whether the author is currentUser.
                className={message.author === currentUser ? 'replies' : 'sent'}>
                <img src="http://emilcarlsson.se/assets/mikeross.png" />
                <p>
                    {message.content}
                    <br />
                    <small>
                       {this.renderTimestamp(message.timestamp)}
                    </small>
                </p>
            </li>
        ));
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render(){
        const messages = this.state.messages;
        return (
            // Define the value property by using Short-circuit-evaluation
            // Like value={this.state.message || ''}
            <div>
                <div className="messages">
                    <ul id="chat-log">
                    {
                        this.props.messages &&
                        this.renderMessages(this.props.messages)
                    }
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                    </ul>
                </div>
                <div className="message-input">
                    <form onSubmit={this.sendMessageHandler}>
                        <div className="wrap">
                            <input
                                onChange={this.messageChangeHandler}
                                value={this.state.message || ''}
                                required
                                id="chat-message-input"
                                type="text"
                                placeholder="Write your message..." />
                            <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                            <button id="chat-message-submit" className="submit">
                                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };
}

// export default Chat;
const mapStateToProps = state => {
    return {
        username: state.auth.username,
        messages: state.message.messages
    };
};

export default connect(mapStateToProps)(Chat);
