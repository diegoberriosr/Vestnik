const Modal = ({ children, isVisible}) => {

  if (!isVisible) return null;  

  return (
    <div className='fixed inset-0 z-50 w-screen h-screen bg-gray-300 backdrop-blur-sm bg-opacity-50 flex justify-center'>
      {children}
    </div>
  )
}

export default Modal
