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
  const { setActiveConversation } = useContext(ConversationContext);
  const {user} = useContext(AuthContext);

  return (
    <li className='w-full h-14 p-5 flex items-center space-x-3 hover:bg-gray-100' onClick={() => setActiveConversation(conversation)}>
      <figure className='w-10 h-10 rounded-full mb-1'> 
        <img src={conversation.partners[0].pfp} alt='conversation partner pfp' className='w-full h-full rounded-full'/>
      </figure>
      <article className='w-10/12'>
        <div className='flex w-full items-center justify-between'>
            <h3 className='font-bold'>{conversation.partners[0].name}</h3>
            <MiniatureDropdownMenu conversationId={conversation.id}/>
        </div>
        <p className='text-gray-500 w-full flex items-center justify-between'>
            { conversation.last_message && 
            <>
              <div className='max-w-[60%] truncate text-sm flex items-center space-x-1'>
                {conversation.last_message.sender.id === user.id && <BsArrowReturnRight/>}
                {conversation.last_message.sender.id !== user.id && !conversation.last_message.read &&  <UnreadMessages number={conversation.unread_messages}/>}
                <span className={ (!conversation.last_message.read && conversation.last_message.sender.id !== user.id) ? 'font-semibold' : ''}>{conversation.last_message.content}</span>
              </div>
              <span className='max-w-[40%] truncate text-xs pt-1'>{formatDate(conversation.last_message.timestamp)}</span>
            </>
            }
        </p>
      </article>
    </li>
  )
}

export default ConversationMiniature
