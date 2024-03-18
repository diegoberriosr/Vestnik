import { useContext } from 'react';

import ConversationsContext from '../../context/ConversationsContext';

const ConversationInformation = () => {
  const {activeConversation} = useContext(ConversationsContext);
  return (
    <div className='w-full p-5 flex flex-col justify-center items-center'>
      <figure className='w-40 h-40 rounded-full'>
        <img src={activeConversation.partners[0].pfp} alt='conversation partner pfp' className='w-full h-full object-fill rounded-full'/>
      </figure>
      <h3 className='text-2xl font-semibold'>{activeConversation.partners[0].name}</h3>
      <h2>~{activeConversation.partners[0].email}</h2>
      <p className='w-full'>{activeConversation.partners[0].info}</p>
    </div>
  )
}

export default ConversationInformation
