import { useState, createContext, useEffect, useContext, useRef} from "react";
import axios from "axios";
import useSound from "use-sound";
import IncomingMessage from '../assets/IncomingMessage.mp3'

import AuthContext from "./AuthContext";

const ConversationsContext = createContext();
export default ConversationsContext;

export const ConversationsProvider = ({ children }) => {

    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [chatSocket, setChatSocket] = useState(null);
    const [typingAlerts, setTypingAlerts] = useState([]);
    const [onlineStatus, setOnlineStatus] = useState(false);
    const [messages, setMessages] = useState([]);
    const [conversationLoading, setConversationLoading] = useState(false);

    const conversationsRef = useRef(conversations);
    const activeConversationRef = useRef(activeConversation);

    const activeConversationId = activeConversation ? activeConversation.id : null;

    const { authTokens, user} = useContext(AuthContext); 
    const [play] = useSound(IncomingMessage);

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
            chatSocket.send(JSON.stringify({
                'type' : 'online_status_update',
                'receiver_ids' : getAllOnlineUserIds(res.data),
                'origin_id' : user.id,
            }));
            setOnlineStatus(true);
        })
        .catch( err => {
            console.log(err);
        })
    };

    const handleSocketNewMessage = (data, conversations, activeConversation) => {
        console.log('xddddd');
        const index = conversations.findIndex( conversation => Number(conversation.id) === Number(data.conversation_id));

        let headers;

        if (authTokens) {
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        }

        if (index > -1) {
            axios({
                url : 'http://127.0.0.1:8000/message',
                method : 'GET',
                headers : headers,
                params : { 'message_id' : data.message_id}
            })
            .then( res => {
                setConversations( prevStatus => {
                    console.log('updating conversations')
                    let updatedStatus = [...prevStatus];
                    updatedStatus[index].last_message = res.data;
                    const unread_messages = updatedStatus[index].unread_messages + 1;

                    if(activeConversation && Number(activeConversation.id) === Number(data.conversation_id) ) updatedStatus[index].last_message.read = true;
                    else updatedStatus[index].unread_messages = unread_messages;

                    if( updatedStatus.length > 0){
                        const filteredConversations = conversations.filter( conversation => Number(conversation.id) !== Number(data.conversation_id));
                        return [updatedStatus[index], ...filteredConversations];
                    }

                    return [updatedStatus];
                });

                if (activeConversation && Number(activeConversation.id) === Number(data.conversation_id)) {
                    console.log('inside active conversation')
                    setActiveConversation(conversations[index]);
                    setMessages( prevStatus => {
                        if (prevStatus.length > 0) return [...prevStatus, res.data];
                        return [res.data];
                    });
                    console.log('about to play')
                    play();
                    console.log('play')
                }
            })
            .catch( error => console.log(error));
        }

        
        else {
           console.log('index not found');
           axios({
            url : 'http://127.0.0.1:8000/conversation',
            method : 'GET',
            headers : headers,
            params :  { conversation_id : data.conversation_id}
           })
           .then( res => {
            console.log(res.data);
            setConversations(prevStatus => {
                const updatedConversations = prevStatus.length > 0 ? [...res.data, ...prevStatus] : [...res.data];
                console.log('Updated conversations:', updatedConversations);
                return updatedConversations;
            })
            console.log(conversations);
           })
           .catch( error => console.log(error))
        }
    };

    const handleSocketDeleteMessage = (data, res) => {
        setConversations( prevStatus => {
            let updatedStatus = [...prevStatus];
            const index = updatedStatus.findIndex( conversation => Number(conversation.id) === Number(data.conversation_id));

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
    };

    const handleSocketUpdateAdmins = (data) => {
        let headers;

        if (authTokens) {
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        }

        axios({
            url : 'http://127.0.0.1:8000/users/ids',
            method : 'GET',
            headers : headers,
            params: { conversation_id : data.conversation_id, user_ids : [data.target_id]}
        })
        .then( res => { 

            const content = `${res.data[0].name} is ${ res.data[0].is_admin ? 'now' : 'no longer' } an admin of this group.`
            const notification = { is_notification : true, sender : null, content : content, timestamp : new Date().getTime()}

            
            setConversations( prevStatus => {
                let updatedStatus = [...prevStatus];
                const index = updatedStatus.findIndex( conversation => Number(conversation.id) === Number(data.conversation_id)); 
                const partners = updatedStatus[index].partners.filter(partner => partner)

                const partnerIndex = partners.findIndex( partner => Number(partner.id) === Number(data.target_id))

                updatedStatus[index].partners[partnerIndex].is_admin = res.data[0].is_admin; 
                updatedStatus[index].last_message = notification;
                return updatedStatus;
            });

            if (activeConversation) {
                setActiveConversation(prevStatus => {
                    let updatedStatus = {...prevStatus};
                    const partnerIndex = updatedStatus.partners.findIndex( partner => partner.id === data.target_id);

                    updatedStatus.partners[partnerIndex].is_admin = res.data[0].is_admin; 
                    updatedStatus.last_message = notification;
                    return updatedStatus;
                });

                setMessages( prevStatus => {
                    return [...prevStatus, notification];
                });
            }
        })
        .catch( err => {
            console.log(err);
        })
    };

    const handleSocketRemoveMember = (data) => {
        const content = `${data.target_name} was removed from the group.`;
        const notification = { is_notification : true, sender : null, content : content, timestamp : new Date().getTime() };
        setConversations( prevStatus => {

            const updatedStatus = [...prevStatus];
            const index = prevStatus.findIndex( conversation => Number(conversation.id) === Number(data.conversation_id));



            updatedStatus[index].partners = updatedStatus[index].partners.filter( partner => partner.id !== data.target_id);
            updatedStatus[index].last_message = notification;

            return updatedStatus;
        });

        if (activeConversation) {
            setActiveConversation( prevStatus => {
                const updatedStatus = {...prevStatus};
                updatedStatus.partners = updatedStatus.partners.filter( partner => partner.id !== data.target_id);
                updatedStatus.last_message = notification;
    
                return updatedStatus;               
            });

            setMessages( prevStatus => {
                return [...prevStatus, notification];
            })
        }
    };

    const handleSocketAddMember = (data) => {
        let headers;

        if (authTokens) {
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        };

        axios({
            url : 'http://127.0.0.1:8000/users/ids',
            method : 'GET',
            headers : headers,
            params : {user_ids : data.target_ids, conversation_id : data.conversation_id}
        })
        .then( res => {
            const notifications = res.data.map( account => ({
                is_notification : true, 
                sender : null,
                content : `${account.name} was added to the group.`, 
                timestamp : new Date().getTime() })
                );
            
            setConversations( prevStatus => {
                let updatedStatus = [...prevStatus];
                const index = updatedStatus.findIndex( conversation => Number(conversation.id) === Number(data.conversation_id));

                updatedStatus[index].partners = [...updatedStatus[index].partners, ...res.data]
                updatedStatus[index].last_message = notifications[notifications.length - 1];

                const filteredConversations = updatedStatus.filter( conversation => conversation.id !== Number(data.conversation_id));
                return [updatedStatus[index], ...filteredConversations];
            });

            if (activeConversation){
                setActiveConversation( prevStatus => {
                    let updatedStatus = {...prevStatus};
                    updatedStatus.partners = [...updatedStatus.partners, ...res.data]
                    updatedStatus.last_message = notifications[notifications.length - 1];
                    return updatedStatus;
                                    
                });
                setMessages( prevStatus => {
                    return [...prevStatus, ...res.data];
                });
            }
        });
    };

    const handleSocketUpdateGroupName = (data) => {

        const content =  `The group's name was changed to ${data.new_name}`;
        const notification = { is_notification : true, sender : null, content : content, timestamp : new Date().getTime()};

        setConversations( prevStatus => {
            let updatedStatus = [...prevStatus];
            const index = updatedStatus.findIndex( conversation => Number(conversation.id) === Number(data.conversation_id));

            updatedStatus[index].name = data.new_name;

            updatedStatus[index].last_message = notification;

            const filteredConversations = updatedStatus.filter( conversation => conversation.id !== Number(data.conversation_id));
            
            return [updatedStatus[index], ...filteredConversations];
        });

        if (activeConversation) {
            setActiveConversation( prevStatus => {
                let updatedStatus = {...prevStatus};
                updatedStatus.name = data.new_name;

                updatedStatus.last_message = notification;
                return updatedStatus;
            });

            setMessages( prevStatus => [...prevStatus, notification]);
        }
    };

    const handleUpdateUnseenMessages = (data, activeConversation) => {
        if (activeConversation && Number(activeConversation.id) === Number(data.conversation_id)) {
            setMessages( prevStatus => {
                let updatedStatus = [...prevStatus];

                updatedStatus.forEach( message => {
                    if (message.read_count < activeConversation.partners.length) message.read_count++; 
                });
                return updatedStatus
            });
        };
    }

    const handleSocketTypingAlert = (data, conversations) => {
        if (conversations.length > 0){
            const index = conversations.findIndex( conversation => Number(conversation.id) === Number(data.conversation_id));
            const typer = conversations[index].partners.filter( partner => Number(partner.id) === Number(data.origin_id))
            
            setTypingAlerts( prevStatus => {
                 return  [...prevStatus, { conversation_id : data.conversation_id, origin_id : data.origin_id, name : typer[0].name}];
            });

            const timer = setTimeout( () => {
                setTypingAlerts( prevStatus => {
                    return prevStatus.filter( alert => alert.conversation_id !== data.conversation_id && alert.origin_id !== data.origin_id);
                });

            }, 10000);

            return () => clearTimeout(timer);
        }
    };

    const getAllOnlineUserIds = (conversations) => {
        const allUsers = conversations.flatMap( conversation => conversation.partners);
        const uniqueUsers = allUsers.reduce( (acc, user) => {
            if(!acc.some( existingUser => existingUser.id === user.id)) {
                acc.push(user);
            }
            return acc;
        }, [])
        const onlineIds = uniqueUsers.filter( user => user.is_online).map( user => user.id);
        return onlineIds;
    };

    const handleSocketUpdateUserOnlineStatus = (data, activeConversation) => {
        setConversations( prevStatus => {
            let updatedStatus = prevStatus.map( conversation => {
                const updatedPartners = conversation.partners.map( partner => {
                    if ( Number(partner.id) === Number(data.origin_id)) return {...partner, is_online : !partner.is_online}
                    return partner
                })
                return {...conversation, partners : updatedPartners}
            })
            return updatedStatus;
        });

        if (activeConversation) {
            const index = activeConversation.partners.findIndex( partner => Number(partner.id) === Number(data.origin_id));
            if ( index > -1 ) {
                setActiveConversation( prevStatus => {
                    let updatedStatus = {...prevStatus};
                    updatedStatus.partners = updatedStatus.partners.map(partner => {
                        if (Number(partner.id) === Number(data.origin_id)) return {...partner, is_online : !partner.is_online}
                        return partner
                    })

                    return updatedStatus;
                });
            }
            
        };
    };


    // Load conversations for the first time
    useEffect(() => {
        console.log('socket changed')
        if (chatSocket && !onlineStatus){
            chatSocket.onopen = () => {
                console.log('socket open!')
                getConversations();
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatSocket]);

    // Load a conversation's messages
    useEffect( () => {
        setConversationLoading(true);
        setMessages([]);
        activeConversationRef.current = activeConversation
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
                setConversations( prevStatus => {
                    let updatedStatus = [...prevStatus];
                    const index = updatedStatus.findIndex( conversation => Number(conversation.id) === Number(activeConversation.id))

                    let last_message = updatedStatus[index].last_message;
                    if (last_message && !last_message.read) {
                        last_message.read = true;
                        updatedStatus[index].last_message = last_message;
                        updatedStatus[index].unread_messages = 0;
                    }

                    return updatedStatus;
                });

                setConversationLoading(false);
                chatSocket.send(JSON.stringify({
                    'type' : 'update_unseen_messages',
                    'receiver_ids' : activeConversation.partners.map( partner => partner.id),
                    'conversation_id' : activeConversation.id
                }))
            })
            .catch( err => {
                setConversationLoading(false);
                console.log(err)
            });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeConversationId]);

    // Conversations effect
    useEffect(() => {
        conversationsRef.current = conversations;
        }, [conversations]);

    // Web sockets
    useEffect( () => {

        let url = `ws://127.0.0.1:8000/ws/${user.user_id}/`
        const socket = new WebSocket(url);
        setChatSocket(socket);
        
        socket.onclose = () => {
        }

        socket.onmessage = (e) => {
            let headers;
        
            if (authTokens){
                headers = {
                    'Authorization' : 'Bearer ' + String(authTokens.access)
                }
            }

            let data = JSON.parse(e.data);
            console.log(data);

            if (data.type === 'new_message') {
                handleSocketNewMessage(data, conversationsRef.current, activeConversationRef.current)
            };

            if (data.type === 'delete_message') {
                axios({
                    url : 'http://127.0.0.1:8000/conversations/messages/last',
                    method : 'GET',
                    headers : headers,
                    params : { conversation_id : data.conversation_id}
                })
                .then( res => {
                    handleSocketDeleteMessage(data, res)
                })
                .catch( err => {
                    console.log(err);
                })
            };

            if (data.type === 'update_group_admin'){
                handleSocketUpdateAdmins(data);
            };

            if (data.type === 'remove_member'){
                handleSocketRemoveMember(data);
            };

            if ( data.type === 'add_members') {
                handleSocketAddMember(data);
            };

            if ( data.type === 'update_group_name'){
                handleSocketUpdateGroupName(data);
            }

            if (data.type === 'typing_alert'){
                handleSocketTypingAlert(data, conversationsRef.current);
            };

            if (data.type === 'update_unseen_messages') {
                handleUpdateUnseenMessages(data, activeConversationRef.current);
            }

            if( data.type === 'online_status_update') {
                console.log(`${data.origin_id} esta vendiendo merca`);
                handleSocketUpdateUserOnlineStatus(data, activeConversationRef.current);
            }
        };      
        return () => socket.close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const data = {
        conversations:conversations,
        setConversations:setConversations,
        activeConversation:activeConversation,
        setActiveConversation:setActiveConversation,
        messages:messages,
        setMessages:setMessages,
        chatSocket:chatSocket,
        typingAlerts:typingAlerts,
        getAllOnlineUserIds:getAllOnlineUserIds,
        conversationLoading:conversationLoading
    };

   return <ConversationsContext.Provider value={data}>
        {children}
    </ConversationsContext.Provider>
}