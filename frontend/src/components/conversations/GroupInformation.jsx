import { useContext } from 'react';

// Icon imports
import { IoAddOutline } from "react-icons/io5";

// Context imports
import AuthContext from '../../context/AuthContext'
import ConversationsContext from '../../context/ConversationsContext'

const GroupInformation = ({ setAddUsersModal, handleUserMenuModal }) => {
  const { user } = useContext(AuthContext);
  const { activeConversation} = useContext(ConversationsContext)
  return (
    <>
            <figure className='relative w-full flex items-center justify-center'>
              <img src={user.pfp} alt='user pfp' className='w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full'/>
              { activeConversation.partners[0] && <img src={activeConversation.partners[0].pfp} alt='partner 1 pfp' className='w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full'/> }
              { activeConversation.partners[1] && <img src={activeConversation.partners[1].pfp} alt='partner 2 pfp' className='w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full'/> }
            </figure>
            <h3 className='text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-6xl mr-auto ml-auto'>{activeConversation.name}</h3>
            <h2 className='text-blue-300'>Change group's name</h2>
            <div className='mt-5 w-full border border-r-0 border-b-0 border-l-0 px-5'>
                <div className='flex space-x-2.5 p-2 bg-white'>
                    <figure className='w-10 h-10'>
                        <img src={user.pfp} alt='user pfp' className='w-full h-full rounded-full object-fit'/>
                    </figure>
                    <p className='w-full flex items-center justify-between'>
                        <span>You {activeConversation.is_admin ? 'ADMIN' : ''}</span>
                        <span>Leave this group</span>
                    </p>
                </div>
                {activeConversation.partners.map( (partner,index) =>
                    <div className='flex space-x-2.5 p-2 bg-white' key={index} onClick={() => {handleUserMenuModal(partner)}}>
                        <figure className='w-10 h-10'>
                            <img key={index} src={partner.pfp} alt={`partner ${index + 1} pfp`} className='w-full h-full rounded-full object-fit'/>
                        </figure>
                        <div className='w-full flex items-start justify-between border border-r-0 border-t-0 border-l-0'>
                            <p className='w-full'>
                                <span>{partner.name} {partner.is_admin ? 'ADMIN' : ''}</span>
                                <span className='max-w-full truncate'>{partner.info}</span>
                            </p>
                            <span>~{partner.email}</span>
                        </div>
                    </div>
                    )}
                <div className='w-full flex items-center h-12 text-blue-300 bg-white p-2 space-x-2.5'>
                    <button className='w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 ' onClick={() => setAddUsersModal(true)}>
                        <IoAddOutline/>
                    </button>
                    <span> Add contact</span>
                </div>
            </div>
    </>
  )
}

export default GroupInformation
