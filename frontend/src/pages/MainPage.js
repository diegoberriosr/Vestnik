import { Routes, Route } from 'react-router-dom';

// Component Imports
import Sidebar from '../components/general/Sidebar'
import Inbox from '../components/general/Inbox';
import Conversation from '../components/general/Conversation';
import NewConversation from '../components/general/NewConversation';

// Provider imports
import { ConversationsProvider } from '../context/ConversationsContext';

const MainPage = () => {

  return (
    <div className='flex'>
      <ConversationsProvider>
        <Sidebar/>
        <Routes>
            <Route element={<Inbox/>} path='/inbox' />
            <Route element={<NewConversation/>} path='/users' />
        </Routes>
        <Conversation/>
      </ConversationsProvider>
    </div>
  )
}

export default MainPage
