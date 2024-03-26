import { useContext } from "react";
import { formatDate } from '../../utils/formatDate';

// Icon imports
import MiniatureDropdownMenu from "./MiniatureDropdownMenu";

// Context imports
import ConversationsContext from "../../context/ConversationsContext";
import AuthContext from "../../context/AuthContext";

const GroupMiniature = ({ group }) => {
  const {setActiveConversation, activeConversation, typingAlerts } = useContext(ConversationsContext);
  const { user } = useContext(AuthContext);

  const typingPartners = typingAlerts.length > 0 ? typingAlerts.filter( alert => alert.conversation_id === group.id): null;
  let typingMessage;

  if (typingPartners && typingPartners.length > 0) typingMessage = typingPartners.length === 1 ? `${typingPartners[0].name} is typing...` : `${typingPartners[0]} and ${typingPartners.length -1} others are typing...`
  const activeConversationId = activeConversation ? activeConversation.id : null
  
  return (
    <li className={`w-full h-14 p-5 flex items-center space-x-3 ${ group.id === activeConversationId ? 'bg-gray-200' : '' } hover:bg-gray-100 rounded transition-colors duration-300`} onClick={() => setActiveConversation(group)}>
      {
        group.partners.length >= 2 &&
        <figure className='relative w-10 h-10'>
          <img src={user.pfp} alt='user pfp' className='mr-auto ml-auto h-5 w-5 rounded-full object-fill'/>
          <img src={group.partners[0].pfp} alt='partner 1 pfp' className='absolute bottom-0 left-0 h-5 w-5 rounded-full object-fill'/>
          <img src={group.partners[1].pfp} alt='partner 1 pfp' className='absolute bottom-0 right-0 h-5 w-5 rounded-full object-fill'/>
        </figure>
      }
      {
        group.partners.length === 1 &&
        <figure className='flex w-10 h-10'>
          <img src={user.pfp} alt='user pfp' className='h-5 w-5 rounded-full object-fill'/>
          <img src={group.partners[0].pfp} alt='partner pfp' className='h-5 w-5 rounded-full object-fill'/>
        </figure>
      }
      {
        group.partners.length === 0 && 
        <figure className='w-10 h-10 rounded-full'>
          <img src={user.pfp} alt='user pfp' className='h-5 w-5 rounded-full object-fill'/>
        </figure>
      }      
      <article className='w-10/12'>
        <div className='flex w-full items-center justify-between'>
            <h3 className='font-bold max-w-[70%] truncate'>{group.name}</h3>
            <div className='h-5 w-5 flex items-center justify-center rounded hover:bg-gray-300 transition-colors duration-300 rounded-full'>
              <MiniatureDropdownMenu conversationId={group.id}/>
            </div>
        </div>
        <p className='text-gray-500 w-full flex items-center justify-between'>
            { typingMessage && <span className='text-sky-500 w-full text-truncate font-bold text-xs italic'>{typingMessage}</span> }
            { group.last_message && !typingMessage &&
            <>
              <span className='max-w-[60%] truncate text-sm'>{group.last_message.content}</span>
              <span className='text-xs pt-1'>{formatDate(group.last_message.timestamp)}</span>
            </>
            }
        </p>
      </article>
    </li>
  )
}

export default GroupMiniature