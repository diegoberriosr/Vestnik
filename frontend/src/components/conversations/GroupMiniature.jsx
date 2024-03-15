import { useContext } from "react";
import MiniatureDropdownMenu from "./MiniatureDropdownMenu";

import ConversationsContext from "../../context/ConversationsContext";
import AuthContext from "../../context/AuthContext";
const GroupMiniature = ({ group }) => {
  const {setActiveConversation } = useContext(ConversationsContext);
  const { user } = useContext(AuthContext);
  
  return (
    <li className='w-full h-14 p-5 flex items-center space-x-3 hover:bg-gray-100' onClick={() => setActiveConversation(group)}>
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
            <MiniatureDropdownMenu conversationId={group.id} isGroup/>
        </div>
        <p className='text-gray-500 h-5'>{group.last_message && group.last_message.content}</p>
      </article>
    </li>
  )
}

export default GroupMiniature