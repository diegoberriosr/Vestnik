import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Icon imports
import { AiFillMessage } from "react-icons/ai";
import { MdPeopleAlt } from "react-icons/md";
import { CiLogout } from "react-icons/ci";

// Context imports
import AuthContext from "../../context/AuthContext";
import ConversationsContext from "../../context/ConversationsContext";

const BottomBar = () => {
  const { logoutUser, user } = useContext(AuthContext);
  const currentUrl = useLocation().pathname;
  const navigate = useNavigate();

  const { chatSocket, getAllOnlineUserIds, conversations} = useContext(ConversationsContext);
  

  const handleLogoutUser = () => {
    chatSocket.send(JSON.stringify({
      'type' : 'online_status_update',
      'receiver_ids' : getAllOnlineUserIds(conversations),
      'origin_id' : user.id,
    }));
    logoutUser()
  };


  return (
    <ul className='fixed bottom-0 xl:hidden w-full h-14 flex z-[10]'>
        <li className={` ${currentUrl === '/inbox' ? 'bg-gray-200' : 'hover:bg-gray-100'} w-4/12 h-full flex justify-center items-center text-gray-600 text-4xl transition-colors duration-300 cursor-pointer`} onClick={() => navigate('/inbox')}>
            <AiFillMessage/>
        </li>
        <li className={` ${currentUrl === '/users' ? 'bg-gray-200' : 'hover:bg-gray-100'} w-4/12 h-full flex justify-center items-center text-gray-600 text-4xl transition-colors duration-300 cursor-pointer`} onClick={() => navigate('/users')}>
            <MdPeopleAlt/>
        </li>
        <li className='w-4/12 h-full flex justify-center items-center hover:bg-gray-100 text-gray-600 text-4xl transition-colors duration-300 cursor-pointer' onClick={handleLogoutUser}>
            <CiLogout/>
        </li>
    </ul>
  )
}

export default BottomBar
