import { useContext } from 'react';

// Icon imports
import { MdArrowBackIos } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaImage } from "react-icons/fa";
import { BiSolidSend } from "react-icons/bi";

// Context imports
import ConversationsContext from '../../context/ConversationsContext';

const Conversation = () => {

  const {activeConversation, setActiveConversation} = useContext(ConversationsContext);

  if (!activeConversation) return null;

  return (
  <main className={`${ activeConversation ? 'w-screen' : ''} w-screen xl:w-[70%] h-screen border`}>
    <header className='w-full h-14 flex items-center justify-between px-5 shadow'>
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
            <BsThreeDots/>
        </div>
    </header>
    <ul className='w-full h-[calc(100vh-114px)] border overflow-y-auto'>
        
    </ul>
    <footer className='w-full h-14 flex items-center justify-between px-5'>
        <FaImage className='text-3xl text-blue-300 cursor-pointer'/>
        <input className='w-[90%] h-10 pl-5 bg-gray-100 rounded-full focus:outline-none focus:border-2 focus:border-blue-300 mx-2 sm:mx-0' placeholder='Type a message'/>
        <button className='h-10 w-10 bg-blue-300 rounded-full text-center text-white flex items-center justify-center'>
            <BiSolidSend className='text-2xl'/>
        </button>
    </footer>
  </main>
  )
}

export default Conversation
