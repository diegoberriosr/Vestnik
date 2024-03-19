import { useState, createContext, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

const ConversationsContext = createContext();
export default ConversationsContext;

export const ConversationsProvider = ({ children}) => {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const activeConversationId = activeConversation ? activeConversation.id : null;
    const [messages, setMessages] = useState([]);

    const { authTokens } = useContext(AuthContext); 
    if (activeConversation) console.log(activeConversation.partners);
    
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

    useEffect(() => {
        getConversations();
    }, []);

    
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
    }, [activeConversationId])


    const data = {
        conversations:conversations,
        setConversations:setConversations,
        activeConversation:activeConversation,
        setActiveConversation:setActiveConversation,
        messages:messages,
        setMessages:setMessages
    }

    return <ConversationsContext.Provider value={data}>
        {children}
    </ConversationsContext.Provider>
}