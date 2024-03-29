import { useState, useContext } from 'react';
import axios from 'axios';

import { PiDotsThreeBold } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { GrClearOption } from "react-icons/gr";
import { MdPushPin } from "react-icons/md";
import { TbArchiveFilled } from "react-icons/tb";

import ConversationsContext from '../../context/ConversationsContext';
import AuthContext from '../../context/AuthContext';

const MiniatureDropdownMenu = ({ conversationId, isGroup}) => {

  const [menuVisible, setMenuVisible] = useState(false);
  const { authTokens } = useContext(AuthContext);
  const { activeConversation, setActiveConversation, setConversations, setMessages} = useContext(ConversationsContext);


  const handleDelete = (e) => {
        e.stopPropagation()
        let headers;
        
        if (authTokens) {
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        }

        const data = isGroup ? { conversation_id : conversationId } : { conversation_id : conversationId, remove_from_inbox : true};
        const url = isGroup ? 'groups/delete' : 'conversations/clear'

        axios({
            url : `http://127.0.0.1:8000/${url}`,
            method : 'PUT',
            headers: headers,
            data : data
        })
        .then( () => {
            if (activeConversation && activeConversation.id === conversationId) setActiveConversation(null);
            setConversations( prevStatus => prevStatus.filter( conversation => Number(conversation.id) !== Number(conversationId)))
        })
        .catch( err => {
            console.log(err);
        });
  }

  const handleClear = (e) => {
    if(e) e.stopPropagation();

    let headers;

    if(authTokens){
        headers = {
            'Authorization' : 'Bearer ' + String(authTokens.access)
        }
    }
    
    axios({
        url : 'http://127.0.0.1:8000/conversations/clear',
        method : 'PUT',
        headers : headers,
        data : { conversation_id : conversationId } 
    })
    .then( () => {
        if (activeConversation) setMessages([]);
        setConversations(prevStatus => {
            const updatedStatus = [...prevStatus];
            const index = updatedStatus.findIndex(conversation => conversation.id === conversationId );
            updatedStatus[index].last_message = null; 

            return updatedStatus;
        })
    })
    .catch( err => {
        console.log(err);
    })
  }
  return (
    <div className='relative flex justify-center text-gray-900'>
        <PiDotsThreeBold className='text-xl cursor-pointer' onClick={(e) => { e.stopPropagation(); setMenuVisible(!menuVisible)}}/>
        <ul className={`absolute top-2 right-0.5 ${menuVisible ? 'block' : 'hidden'} w-36 bg-white border border-gray-100 shadow rounded z-[1000] transition-colors duration-300 animate-materialize`} onMouseLeave={() => setMenuVisible(false)}>
            <li className='flex items-center space-x-2.5 hover:bg-gray-100 hover:font-semibold px-1 py-0.5 cursor-pointer' onClick={e => handleDelete(e)}>
                <MdDelete className='text-red-900'/>
                <span>Delete</span>
            </li>
            <li className='flex items-center space-x-2.5 hover:bg-gray-100 hover:font-semibold px-1 py-0.5 border-t border-gray-100 cursor-pointer' onClick={e => handleClear(e)}>
                <GrClearOption className='text-red-900'/>
                <span>Clear</span>
            </li>
            <li className='flex items-center space-x-2.5 hover:bg-gray-100 hover:font-semibold px-1 py-0.5 border-t border-gray-100 cursor-pointer'>
                <MdPushPin className='text-gray-600'/>
                <span>Pin</span>
            </li>
            <li className='flex items-center space-x-2.5 hover:bg-gray-100 px-1 hover:font-semibold py-0.5 border-t border-gray-100 cursor-pointer'>
                <TbArchiveFilled className='text-gray-600'/>
                <span>Archive</span>
            </li>
        </ul>
    </div>
  )
}

export default MiniatureDropdownMenu
