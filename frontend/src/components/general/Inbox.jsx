import { useContext } from 'react';


// Icon imports
import { MdOutlineGroupAdd } from "react-icons/md";

// Component imports
import BottomBar from './BottomBar';

// Context imports
import ConversationsContext from '../../context/ConversationsContext';


const Inbox = () => {
  const {activeConversation, setActiveConversation} = useContext(ConversationsContext)
  return (
  <aside className={`${ activeConversation ? 'hidden xl:block w-[25%]' :  'w-screen xl:w-[25%]'} h-screen border`}>
    <header className='h-14 w-full flex items-center justify-between px-5'>
      <h6 className='text-2xl font-bold'>Messages</h6>
      <i className='bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90 cursor-pointer'>
        <MdOutlineGroupAdd className='text-lg text-gray-600'/>
      </i>
    </header>
    <ul className='w-full h-[calc(100vh-113px)] xl:h-[calc(100vh-57px)] overflow-y-auto'>
      <li onClick={() => setActiveConversation(true)} className='text-8xl'>Conversations</li>
    </ul>
    <BottomBar/>
  </aside>
  )
}

export default Inbox
