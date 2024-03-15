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
  console.log(conversationId);
  const [menuVisible, setMenuVisible] = useState(false);
  const { authTokens } = useContext(AuthContext);
  const { activeConversation, setActiveConversation, setConversations} = useContext(ConversationsContext);

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
        })
  }

  return (
    <div className='relative flex justify-center'>
        <PiDotsThreeBold className='text-xl cursor-pointer' onClick={(e) => { e.stopPropagation(); setMenuVisible(!menuVisible)}}/>
        <ul className={`absolute top-2 right-0.5 ${menuVisible ? 'block' : 'hidden'} w-20 bg-white border border-black rounded z-[1000] transition-colors duration-300`} onMouseLeave={() => setMenuVisible(false)}>
            <li className='flex items-center space-x-1 hover:bg-gray-100 px-1 py-0.5 cursor-pointer' onClick={e => handleDelete(e)}>
                <MdDelete className='text-red-900'/>
                <span>Delete</span>
            </li>
            <li className='flex items-center space-x-1 hover:bg-gray-100 px-1 py-0.5'>
                <GrClearOption className='text-red-900'/>
                <span>Clear</span>
            </li>
            <li className='flex items-center space-x-1 hover:bg-gray-100 px-1 py-0.5'>
                <MdPushPin className='text-gray-600'/>
                <span>Pin</span>
            </li>
            <li className='flex items-center space-x-1 hover:bg-gray-100 px-1 py-0.5'>
                <TbArchiveFilled className='text-gray-600'/>
                <span>Archive</span>
            </li>
        </ul>
    </div>
  )
}

export default MiniatureDropdownMenu
