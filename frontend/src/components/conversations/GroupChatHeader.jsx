import { useContext } from 'react';

// Icon imports
import { MdArrowBackIos } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";


// Context imports
import ConversationsContext from '../../context/ConversationsContext';
import AuthContext from '../../context/AuthContext';

const GroupChatHeader = ({ setDisplayInformation }) => {
  const {activeConversation, setActiveConversation} = useContext(ConversationsContext);
  const { user } = useContext(AuthContext);

  let message;
  if (activeConversation.partners.length === 0) message = 'Just you.'
  else if (activeConversation.partners.length === 1) message = `You and ${activeConversation.partners[0].name}.`
  else if (activeConversation.partners.length === 2) message = `${activeConversation.partners[0].name}, ${activeConversation.partners[1].name}, and you.`
  else if (activeConversation.partners.length === 3) message = `${activeConversation.partners[0].name}, ${activeConversation.partners[1].name}, ${activeConversation.partners[2].name}, and you.`
  else message = `You, ${activeConversation.partners[0].name}, and ${activeConversation.partners.length - 2} others.`



  return (
    <>
        <div className='flex items-center'>
            <MdArrowBackIos className='block xl:hidden mr-5 text-sky-500 cursor-pointer' onClick={() => setActiveConversation(null)}/>
            {activeConversation.partners.length > 1 &&
            <figure className='relative h-10 w-10 rounded-full mb-1'>
                <img src={user.pfp} alt='conversation partner pfp' className='ml-2.5 w-5 h-5 rounded-full object-fill'/>
                <img src={activeConversation.partners[0].pfp} alt='conversation partner pfp' className='absolute bottom-0 left-0 w-5 h-5 rounded-full object-fill'/>
                <img src={activeConversation.partners[1].pfp} alt='conversation partner pfp' className='absolute bottom-0 right-0 w-5 h-5 rounded-full object-fill'/>
            </figure>
            }
            {
                activeConversation.partners.length === 1 &&
            <figure className='relative h-10 w-10 rounded-full mb-1 flex items-center'>
                <img src={user.pfp} alt='conversation partner pfp' className='w-5 h-5 rounded-full object-fill'/>
                <img src={activeConversation.partners[0].pfp} alt='conversation partner pfp' className='w-5 h-5 rounded-full object-fill'/>
            </figure>
            }
            <div className='ml-2'>
                <div className='font-bold p-0 mb-0 text-sm'>{activeConversation.name}</div>
                <div className='text-gray-600 text-xs'>{message}</div>
            </div>
        </div>
        <div className='w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors duration-300 cursor-pointer'>
            <BsThreeDots className='text-sky-500 text-2xl' onClick={() => setDisplayInformation(true)}/>
        </div>
    </>
  )
}

export default GroupChatHeader
