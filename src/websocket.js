class WebSocketService {

    static instance = null;
    // callbacks Dictionary use for new messages commands
    callbacks = {};

    static getInstance() {
        if(!WebSocketService.instance){
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    constructor() {
        this.socketRef = null;
    }

    connect(chatUrl) {
        const path = `${SOCKET_URL}/ws/chat/${chatUrl}/`;
        console.log(path);
        this.socketRef = new WebSocket(path);
        this.socketRef.onopen = () => {
            console.log('websocket open');
        };
//        this.socketNewMessage(JSON.stringify({
//            command: 'fetch_messages'
//        }))
        this.socketRef.onmessage = e => {
            // Sending a message
            this.socketNewMessage(e.data);
        }
        this.socketRef.onerror = e => {
            console.log(e.message);
        }
        this.socketRef.onclose = () => {
            console.log('websocket is closed');
            this.connect();
        }
    }

    disconnect() {
        this.socketRef.close();
    }

    socketNewMessage(data){
        // Read an object as JSON File
        const parsedData = JSON.parse(data);
        // If fetch message or new message, then
        // grabing this command, and terminate if the commands
        // then we are going to handle all those messages
        // coming through, and new message handle as new message
        const command = parsedData.command;
        // If Object.keys callbacks, then it goes to 'callbacks = {};'
        if(Object.keys(this.callbacks).length === 0){
            return;
        }
        if(command === 'messages'){
            this.callbacks[command](parsedData.messages);
        }
        console.log(this);
        if(command === 'new_message'){
            /// Problem Area
            this.callbacks[command](parsedData.message);
        }
        console.log(this);
    }

    // Pass through admin.
    // Add chatID parameter that fetch_messages chatID passed it.
    fetchMessages(username, chatId){
        this.sendMessage({
            command: 'fetch_messages',
            username: username,
            chatId: chatId
        });
        console.log(chatId);
        console.log(username);
    }


    newChatMessage(message){
        this.sendMessage({
            command: 'new_message',
            from: message.from,
            message: message.content,
            chatId: message.chatId
        });
        console.log(message);
    }

    // Basically parsed in the names of functions to actually be called
    // when theses callbacks tlace or these commands are taking place.
    addCallbacks(messagesCallback, newMessageCallback){
        this.callbacks['messages'] = messagesCallback;
        this.callbacks['new_message'] = newMessageCallback;
    }

    sendMessage(data){
        try{
            this.socketRef.send(JSON.stringify({ ...data }))
        } catch (err){
            console.log(err.message);
        }
    }

    state() {
        return this.socketRef.readyState;
    }

    // It has Timeout function, and Chat.js importing this function.
    // Basically ensure that we wait for the connection to be steady.
    // Call this the wait for socket connection method.
//    waitForSocketConnection(callback){
//        const socket = this.socketRef;
//        const recursion = this.waitForSocketConnection;
//        // It can maintain connected conditions.
//
//        setTimeout(
//            // Set Times by seconds milliseconds.
//            function(){
//            if (socket.readyState === 1){
//                console.log('connection is secure');
//                // if didn't pass in a callback,
//                // then call the callback.
//                if(callbacks != null){
//                    callback();
//                }
//                // Otherwise will just return.
//                return;
//            } else {
//                console.log('waiting for connection...');
//                recursion(callback);
//            }
//        }, 1);
//    }
}

// Call Method 'getInstance()' which is static.
const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
