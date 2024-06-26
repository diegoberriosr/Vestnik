import { useContext } from 'react';
import { formatDate } from '../../utils/formatDate';

//Icon imports
import { BsArrowReturnRight } from "react-icons/bs";

// Component imports
import MiniatureDropdownMenu from "./MiniatureDropdownMenu";
import UnreadMessages from './UnreadMessages';
// Context imports
import ConversationContext from '../../context/ConversationsContext';
import AuthContext from '../../context/AuthContext';

const ConversationMiniature = ({ conversation }) => {
  const { setActiveConversation, activeConversation, typingAlerts} = useContext(ConversationContext);
  const {user} = useContext(AuthContext);

  const typingPartner = typingAlerts.length > 0 ? typingAlerts.filter( alert => alert.conversation_id === conversation.id): null;
  
  let typingMessage;
  if (typingPartner && typingPartner.length > 0) typingMessage = 'typing...'

  const activeConversationId = activeConversation ? activeConversation.id : null
  return (
    <li className={`w-full h-14 p-5 flex items-center space-x-3 ${ conversation.id === activeConversationId ? 'bg-gray-200' : '' } hover:bg-gray-100  rounded transition-colors duration-300`} onClick={() => setActiveConversation(conversation)}>
      <figure className='relative w-10 h-10 rounded-full mb-1'>
        {conversation.partners[0].is_online && <div className={`absolute -right-1 -top-1 w-4 h-4 rounded-full border-2 ${ conversation.id === activeConversationId ? 'border-gray-200' : 'border-white'} bg-green-600`} />} 
        <img src={conversation.partners[0].pfp} alt='conversation partner pfp' className='w-full h-full rounded-full'/>
      </figure>
      <article className='w-10/12'>
        <div className='flex w-full items-center justify-between'>
            <h3 className='font-bold'>{conversation.partners[0].name}</h3>
            <div className='h-5 w-5 flex items-center justify-center rounded hover:bg-gray-300 transition-colors duration-300 rounded-full'>
              <MiniatureDropdownMenu conversationId={conversation.id}/>
            </div>
        </div>
        <p className='text-gray-500 w-full flex items-center justify-between'>
            { conversation.last_message && !typingMessage &&
            <>
              <span className='max-w-[60%] truncate text-sm flex items-center space-x-1'>
                {conversation.last_message.sender.id === user.id && <BsArrowReturnRight/>}
                {conversation.last_message.sender.id !== user.id && !conversation.last_message.read &&  <UnreadMessages number={conversation.unread_messages}/>}
                <span className={ (!conversation.last_message.read && conversation.last_message.sender.id !== user.id) ? 'font-semibold' : ''}>{conversation.last_message.content}</span>
              </span>
              <span className='max-w-[40%] truncate text-xs pt-1'>{formatDate(conversation.last_message.timestamp)}</span>
            </>
            }
            { typingMessage &&
              <span className='w-full text-truncate text-xs text-sky-500 italic'>typing...</span>
            }
        </p>
      </article>
    </li>
  )
}

export default ConversationMiniature
