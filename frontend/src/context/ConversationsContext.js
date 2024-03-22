import { useState, createContext, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

const ConversationsContext = createContext();
export default ConversationsContext;

export const ConversationsProvider = ({ children}) => {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [chatSocket, setChatSocket] = useState(null);

    const activeConversationId = activeConversation ? activeConversation.id : null;
    const [messages, setMessages] = useState([]);

    const { authTokens, user} = useContext(AuthContext); 
    
    const getConversations = () => {
        let headers;

        if (authTokens) {
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        };

        axios({
            url : 'http://127.0.0.1:8000/conversations',
            method : 'GET',
            headers : headers
        })
        .then( res => {
            setConversations(res.data);
        })
        .catch( err => {
            console.log(err);
        })
    }

    // Load conversations for the first time
    useEffect(() => {
        getConversations();
    }, []);

    // Load a conversation's messages
    useEffect( () => {
        let headers;

        if (authTokens){
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        }
        if (activeConversation) {
            axios({
                url: 'http://127.0.0.1:8000/conversations/messages',
                method : 'GET',
                headers : headers,
                params : { conversation_id : activeConversation.id}
            })
            .then ( res => {
                setMessages(res.data);
            })
            .catch( err => {
                console.log(err)
            });
        };
    }, [activeConversationId]);

    // Web sockets
    useEffect( () => {

        let url = `ws://127.0.0.1:8000/ws/${user.user_id}/`
        const socket = new WebSocket(url);
        setChatSocket(socket);

        socket.onmessage = (e) => {
            let headers;
        
            if (authTokens){
                headers = {
                    'Authorization' : 'Bearer ' + String(authTokens.access)
                }
            }

            let data = JSON.parse(e.data);
            if (data.type === 'new_message') {
                axios({
                    url : 'http://127.0.0.1:8000/message',
                    method : 'GET',
                    headers : headers,
                    params : { message_id : data.message_id}
                })
                .then( res => {
                    setConversations( prevStatus => {
                        let updatedStatus = [...prevStatus];
                        const index = updatedStatus.findIndex( conversation => conversation.id === data.conversation_id);

                        updatedStatus[index].last_message = res.data;

                        if ( updatedStatus.length > 0 ) {
                            let filteredConversations = updatedStatus.filter( conversation => conversation.id !== data.conversation_id);
                            return [updatedStatus[index], ...filteredConversations]                            
                        }

                        return [updatedStatus];
                    });

                    if (activeConversation) {
                        setActiveConversation( prevStatus => {
                            let updatedStatus = {...prevStatus};
                            updatedStatus.last_message = res.data;
                            return updatedStatus;
                        });
                        
                        setMessages( prevStatus => {
                            console.log('adding a message...')
                            let updatedStatus = [...prevStatus];
                            
                            if (updatedStatus.length > 0) return [...prevStatus, res.data];
                            return [res.data];
                        })
                    }
                })
            }

            if (data.type === 'delete_message') {
                axios({
                    url : 'http://127.0.0.1:8000/conversations/messages/last',
                    method : 'GET',
                    headers : headers,
                    params : { conversation_id : data.conversation_id}
                })
                .then( res => {

                    setConversations( prevStatus => {
                        let updatedStatus = [...prevStatus];
                        const index = updatedStatus.findIndex( conversation => conversation.id === data.conversation_id);

                        updatedStatus[index].last_message = res.data;
                        return updatedStatus;
                    });

                    if (activeConversation){
                            setActiveConversation( prevStatus => {
                                let updatedStatus = {...prevStatus};
                                updatedStatus.last_message = res.data;
                                return updatedStatus;
                            })
            
                            setMessages( prevStatus => {
                                return prevStatus.filter( message => message.id !== data.message_id);
                            });                   
                    }
                })
                .catch( err => {
                    console.log(err);
                })
            }
        }

        socket.onopen = () => {
            console.log('Open');
        };

        socket.onclose = () => {
            console.log('Closed')
        }

        return () => socket.close()
    }, []);

    const data = {
        conversations:conversations,
        setConversations:setConversations,
        activeConversation:activeConversation,
        setActiveConversation:setActiveConversation,
        messages:messages,
        setMessages:setMessages,
        chatSocket:chatSocket
    }

    return <ConversationsContext.Provider value={data}>
        {children}
    </ConversationsContext.Provider>
}