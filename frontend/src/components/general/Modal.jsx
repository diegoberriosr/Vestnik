const Modal = ({ children, isVisible, full}) => {

  if (!isVisible) return null;  

  return (
    <div className={`${ full ? 'fixed w-screen h-screen  z-50' : 'absolute w-full h-[calc(100vh-2px)] z-[25]' }  inset-0 bg-gray-400 backdrop-blur-sm bg-opacity-50 flex justify-center`}>
      {children}
    </div>
  )
}

export default Modal
