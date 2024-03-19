import { useState, useEffect } from 'react';

import GroupInformation from './GroupInformation';
import ConversationInformation from './ConversationInformation';
import Modal from '../general/Modal';
import AddUsers from './AddUsers';
import UserMenu from './UserMenu';

const ConversationDrawer = ({ isVisible, setDisplayInformation, isGroup, isAdmin }) => {

  const [addUsersModal, setAddUsersModal] = useState(false);
  const [userMenuModal, setUserMenuModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [shrink, setShrink] = useState(false);

  const handleUserMenuModal = (user) => {
    setSelectedUser(user);
    setUserMenuModal(true);
  }
  useEffect( () => {
    if (shrink && addUsersModal) {
      const timer = setTimeout( () => {
        setAddUsersModal(false);
        setShrink(false);
      }, 250);

      return () => clearTimeout(timer);
    }

    if (shrink && userMenuModal) {
      const timer = setTimeout( () => {
        setUserMenuModal(false);
        setShrink(false);
        setSelectedUser(null);
      }, 250);

      return () => clearTimeout(timer);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shrink])


  return (
    <>
      <div className={`fixed top-0 right-0 ${ isVisible ? 'w-[50%]' : 'w-0'} pt-5 h-screen transition-all duration-500 bg-gray-100`} onMouseLeave={() => setDisplayInformation(false)}>
          <div className={`${isVisible ? '' : 'hidden'} flex flex-col items-center justify-center`}>
            {isGroup ? <GroupInformation isAdmin={isAdmin} setAddUsersModal={setAddUsersModal} handleUserMenuModal={handleUserMenuModal}/> : <ConversationInformation/>}
          </div>
          <div className='absolute bottom-0 w-full'>
            <button className='bg-red-900 text-white w-full h-10 rounded-lg text-center'>
              Delete conversation
            </button>
          </div>
      </div>
      <Modal isVisible={addUsersModal}>
        <AddUsers shrink={shrink} setShrink={setShrink}/>
      </Modal>
      <Modal isVisible={userMenuModal}>
      {selectedUser && <UserMenu user={selectedUser} shrink={shrink} setShrink={setShrink} /> }
      </Modal>
    </>
  )
}

export default ConversationDrawer
