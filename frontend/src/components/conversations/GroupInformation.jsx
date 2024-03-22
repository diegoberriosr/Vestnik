import { useContext } from 'react';

// Icon imports
import { IoAddOutline } from "react-icons/io5";


// Component imports
import AdminBadge from '../alerts/AdminBadge';

// Context imports
import AuthContext from '../../context/AuthContext'
import ConversationsContext from '../../context/ConversationsContext'

const GroupInformation = ({ setAddUsersModal, handleUserMenuModal, setChangeNameModal }) => {
  const { user } = useContext(AuthContext);
  const { activeConversation} = useContext(ConversationsContext);

  return (
    <>
            <figure className='relative w-5/12'>
              <img src={user.pfp} alt='user pfp' className='mr-auto ml-auto w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full'/>
              { activeConversation.partners[0] && <img src={activeConversation.partners[0].pfp} alt='partner 1 pfp' className='absolute top-0 left-0 w-7 h-7 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-20 lg:h-20 rounded-full'/> }
              { activeConversation.partners[1] && <img src={activeConversation.partners[1].pfp} alt='partner 2 pfp' className='absolute bottom-0 right-0 w-7 h-7 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-20 lg:h-20 rounded-full'/> }
              { activeConversation.partners[2] && <img src={activeConversation.partners[2].pfp} alt='partner 3 pfp' className='absolute top-2 right-0 w-3 h-3 md:w-5 md:h-5 lg:w-10 lg:h-10 rounded-full z-[100] rotate-12'/> }  
              { activeConversation.partners[3] && <img src={activeConversation.partners[3].pfp} alt='partner 4 pfp' className='absolute bottom-4 -left-3 w-3 h-3 md:w-5 md:h-5 lg:w-10 lg:h-10 rounded-full z-[100] rotate-8 '/> }   
              { activeConversation.partners[4] && <img src={activeConversation.partners[4].pfp} alt='partner 5 pfp' className='absolute bottom-1 left-10 w-3 h-3 md:w-5 md:h-5 lg:w-10 lg:h-10 rounded-full z-[100]'/> }           
            </figure>
            <h3 className='text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-6xl mr-auto ml-auto'>{activeConversation.name}</h3>
            { activeConversation.is_admin && <h2 className='text-sm md:text-md mt-1 sm:mt-5 text-blue-300 cursor-pointer' onClick={() => {setChangeNameModal(true)}}>Change group's name</h2> }
            <div className='w-full text-xs sm:text-sm md:text-md'>
                <div className='mt-5 w-full px-5 cursor-pointer max-h-[50vh] overflow-y-auto'>
                    <div className='flex space-x-2.5 p-2 bg-white hover:bg-gray-50 rounded-t-lg'>
                        <figure className='w-10 h-10'>
                            <img src={user.pfp} alt='user pfp' className='w-full h-full rounded-full object-fit'/>
                        </figure>
                        <p className='w-full flex items-center justify-between'>
                            <span className='flex items-center'>You { activeConversation.is_admin && <AdminBadge/>} </span>
                            <span>Leave this group</span>
                        </p>
                    </div>
                    {activeConversation.partners.map( (partner,index) =>
                        <div className='flex space-x-2.5 p-2 bg-white hover:bg-gray-50 cursor-pointer' key={index} onClick={() => {handleUserMenuModal(partner)}}>
                            <figure className='w-10 h-10'>
                                <img key={index} src={partner.pfp} alt={`partner ${index + 1} pfp`} className='w-full h-full rounded-full object-fit'/>
                            </figure>
                            <div className='w-full flex items-start justify-between border border-r-0 border-t-0 border-l-0'>
                                <p className='w-full'>
                                    <span className='flex items-center'>{partner.name} {partner.is_admin && <AdminBadge/>}</span>
                                    <span className='max-w-full truncate'>{partner.info}</span>
                                </p>
                                <span>~{partner.email}</span>
                            </div>
                        </div>
                        )}
                    <div className='w-full flex items-center h-12 text-blue-300 bg-white p-2 space-x-2.5 hover:bg-gray-50 rounded-b-lg cursor-pointer' onClick={() => setAddUsersModal(true)}>
                        <button className='w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 '>
                            <IoAddOutline/>
                        </button>
                        <span> Add contact</span>
                    </div>
            </div>
            </div>
    </>
  )
}

export default GroupInformation
