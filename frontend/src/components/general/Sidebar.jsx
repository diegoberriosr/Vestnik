import { useState, useEffect, useContext} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AiFillMessage } from "react-icons/ai";
import { MdPeopleAlt } from "react-icons/md";
import { CiLogout } from "react-icons/ci";

import Modal from './Modal';
import EditProfile from './EditProfile';

import AuthContext from '../../context/AuthContext';
import ConversationsContext from '../../context/ConversationsContext';

const Sidebar = () => {

  const [profileModal, setProfileModal] = useState(false);
  const [shrink, setShrink] = useState(false);
  const currentUrl = useLocation().pathname;
  
  const { user, logoutUser } = useContext(AuthContext);
  const { chatSocket, getAllOnlineUserIds, conversations} = useContext(ConversationsContext);

  const navigate = useNavigate();

  const handleLogoutUser = () => {
    console.log('disconnecting...')
    chatSocket.send(JSON.stringify({
      'type' : 'online_status_update',
      'receiver_ids' : getAllOnlineUserIds(conversations),
      'origin_id' : user.id,
    }));
    logoutUser()
  };

  useEffect( () => {
    if(shrink) {
      setShrink(false);
      setProfileModal(false);
    }
  }, [shrink]);
 
  return (
   <>
    <nav className='hidden xl:flex xl:flex-col w-[5%] h-screen border items-center py-2.5'>
        <div className={`h-10 w-10 ${ currentUrl === '/inbox' ? 'bg-gray-200' : 'hover:bg-gray-100'} rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-500`} onClick={() => navigate('/inbox')}>
          <AiFillMessage className='text-2xl text-gray-600'/>
        </div>
        <div className={`h-10 w-10 ${ currentUrl === '/users' ? 'bg-gray-200' : 'hover:bg-gray-100'} rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-500`} onClick={() => navigate('/users')}>
          <MdPeopleAlt className='text-2xl text-gray-600'/>
        </div> 
        <div className='h-10 w-10 hover:bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-500' onClick={handleLogoutUser}>
          <CiLogout className='text-2xl text-gray-600'/>
        </div>
        <div className='relative mt-auto h-10 w-10 rounded-full cursor-pointer' onClick={() => {setProfileModal(true)}}>
          <div className='absolute top-0 right-0 border-2 boder-white h-4 w-4 bg-green-600 rounded-full'/>
          <img src={user ? user.pfp : null} alt='user pfp' className='w-10 h-10 rounded-full object-fill'/>
        </div>
    </nav>
    <Modal isVisible={profileModal} full={true}>
      <EditProfile shrink={shrink} setShrink={setShrink}/>
    </Modal>
   </>
  )
}

export default Sidebar
