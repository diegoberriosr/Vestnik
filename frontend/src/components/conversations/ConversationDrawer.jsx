import { useState, useEffect } from 'react';

import GroupInformation from './GroupInformation';
import ConversationInformation from './ConversationInformation';
import Modal from '../general/Modal';
import AddUsers from './AddUsers';


const ConversationDrawer = ({ isVisible, setDisplayInformation, isGroup, isAdmin }) => {

  const [addUsersModal, setAddUsersModal] = useState(false);
  const [shrink, setShrink] = useState(false);

  useEffect( () => {
    if (shrink && addUsersModal) {
      const timer = setTimeout( () => {
        setAddUsersModal(false);
        setShrink(false);
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [shrink])


  return (
    <>
      <div className={`fixed top-0 right-0 ${ isVisible ? 'w-[50%]' : 'w-0'} pt-5 h-screen transition-all duration-500 bg-gray-100`} onMouseLeave={() => setDisplayInformation(false)}>
          <div className={`${isVisible ? '' : 'hidden'} flex flex-col items-center justify-center`}>
            {isGroup ? <GroupInformation isAdmin={isAdmin} setAddUsersModal={setAddUsersModal}/> : <ConversationInformation/>}
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
    </>
  )
}

export default ConversationDrawer
