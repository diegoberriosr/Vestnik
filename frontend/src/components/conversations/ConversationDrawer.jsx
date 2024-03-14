
const ConversationDrawer = ({ isVisible, setDisplayInformation }) => {
  
  return (
    <div className={`fixed top-0 right-0 ${ isVisible ? 'w-[50%]' : 'w-1'} h-screen transition-all duration-500 bg-white`}>
        <div className={`${isVisible ? '' : 'hidden'}`}>
            <span onClick={() => setDisplayInformation(false)}>XD</span>
        </div>
    </div>
  )
}

export default ConversationDrawer
