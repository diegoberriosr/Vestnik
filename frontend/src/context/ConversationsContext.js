import { useState, createContext, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

const ConversationsContext = createContext();
export default ConversationsContext;

export const ConversationsProvider = ({ children}) => {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [chatSocket, setChatSocket] = useState(null);
    const [typingAlerts, setTypingAlerts] = useState([]);
    console.log(typingAlerts);
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
    };

    const handleSocketNewMessage = (data, res) => {
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

                let updatedStatus = [...prevStatus];
                
                if (updatedStatus.length > 0) return [...prevStatus, res.data];
                return [res.data];
            })
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


    // Load conversations for the first time
    useEffect(() => {
        getConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    handleSocketNewMessage(data, res);
                })
                .catch( err => {
                    console.log(err);
                })
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
                const index = conversations.findIndex( conversation => Number(conversation.id) === Number(data.conversation_id));
                const typer = conversations[index].partners.filter( partner => Number(partner.id) === Number(data.origin_id))
                
                setTypingAlerts( prevStatus => {
                     return  [...prevStatus, { conversation_id : data.conversation_id, origin_id : data.origin_id, name : typer[0].name}];
                });

                const timer = setTimeout( () => {
                    setTypingAlerts( prevStatus => {
                        return prevStatus.filter( alert => alert.conversation_id !== data.conversation_id && alert.origin_id !== data.origin_id);
                    });
                    console.log('Alert typing is over');
                }, 10000);

                return () => clearTimeout(timer);
            }
        };

        socket.onopen = () => {
            console.log('Open');
        };

        socket.onclose = () => {
            console.log('Closed')
        }

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
        typingAlerts:typingAlerts
    };

   return <ConversationsContext.Provider value={data}>
        {children}
    </ConversationsContext.Provider>
}