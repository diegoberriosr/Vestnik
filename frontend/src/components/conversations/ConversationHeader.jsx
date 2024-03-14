import { useContext } from 'react';

// Icon imports
import { MdArrowBackIos } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";


// Context imports
import ConversationsContext from '../../context/ConversationsContext';


const ConversationHeader = ({ setDisplayInformation}) => {
  const {activeConversation, setActiveConversation} = useContext(ConversationsContext);
  return (
    <>
            <div className='flex items-center'>
            <MdArrowBackIos className='block xl:hidden mr-5 text-blue-300 cursor-pointer' onClick={() => setActiveConversation(null)}/>
            <figure className='h-10 w-10 rounded-full mb-1'>
                <img src={activeConversation.partners[0].pfp} alt='conversation partner pfp' className='w-full h-full rounded-full object-fill'/>
            </figure>
            <div className='ml-2'>
                <div className='font-bold p-0 mb-0 text-sm'>{activeConversation.partners[0].name}</div>
                <div className='text-gray-600 text-xs'>Online/offline</div>
            </div>
        </div>
        <div>
            <BsThreeDots onClick={() => setDisplayInformation(true)}/>
        </div>
    </>
  )
}

export default ConversationHeader
