
// Component Imports
import Sidebar from '../components/general/Sidebar'
import Inbox from '../components/general/Inbox';
import Conversation from '../components/general/Conversation';

// Provider imports
import { ConversationsProvider } from '../context/ConversationsContext';

const MainPage = () => {

  return (
    <div className='flex'>
      <ConversationsProvider>
        <Sidebar/>
        <Inbox/>
        <Conversation/>
      </ConversationsProvider>
    </div>
  )
}

export default MainPage
