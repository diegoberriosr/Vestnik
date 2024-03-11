import { useState, createContext } from "react";

const ConversationsContext = createContext();
export default ConversationsContext;

export const ConversationsProvider = ({ children}) => {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);

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