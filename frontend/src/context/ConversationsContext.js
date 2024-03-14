import { useState, createContext, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

const ConversationsContext = createContext();
export default ConversationsContext;

export const ConversationsProvider = ({ children}) => {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const { authTokens } = useContext(AuthContext); 

    
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
    }, []) 

    console.log(conversations);
    
    const data = {
        conversations:conversations,
        setConversations:setConversations,
        activeConversation:activeConversation,
        setActiveConversation:setActiveConversation
    }

    return <ConversationsContext.Provider value={data}>
        {children}
    </ConversationsContext.Provider>
}