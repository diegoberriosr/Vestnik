import { useContext } from 'react';

// Icon imports
import { MdArrowBackIos } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";


// Context imports
import ConversationsContext from '../../context/ConversationsContext';


const ConversationHeader = ({ setDisplayInformation}) => {
  const {activeConversation, setActiveConversation, typingAlerts } = useContext(ConversationsContext);

  if (typingAlerts.length > 0) console.log( typingAlerts[0].conversation_id, activeConversation.id, typingAlerts[0].conversation_id === activeConversation.id);
  const typingPartner = typingAlerts.length > 0 ? typingAlerts.filter( alert => alert.conversation_id === activeConversation.id): null;
  
  let typingMessage;

  if (typingPartner && typingPartner.length > 0) typingMessage = 'typing...'

  return (
    <>
            <div className='flex items-center'>
            <MdArrowBackIos className='block xl:hidden mr-5 text-sky-500 cursor-pointer' onClick={() => setActiveConversation(null)}/>
            <figure className='h-10 w-10 rounded-full mb-1'>
                <img src={activeConversation.partners[0].pfp} alt='conversation partner pfp' className='w-full h-full rounded-full object-fill'/>
            </figure>
            <div className='ml-2'>
                <div className='font-bold p-0 mb-0 text-sm'>{activeConversation.partners[0].name}</div>
                { typingMessage ?
                  <div className='w-full truncate text-xs text-sky-500 italic'>typing...</div>
                  :
                  <div className='text-gray-600 text-xs'>Online/offline</div>
                }
            </div>
        </div>
        <div className='w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors duration-300 cursor-pointer'>
            <BsThreeDots className='text-sky-500 text-2xl' onClick={() => setDisplayInformation(true)}/>
        </div>
    </>
  )
}

export default ConversationHeader
