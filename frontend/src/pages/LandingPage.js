import { useState } from 'react';
import LayingDoodle from '../assets/LayingDoodle.png';

// Icon Imports
import { PiMessengerLogoLight } from "react-icons/pi";
import { FaFacebookMessenger } from "react-icons/fa";

// Component imports
import Modal from '../components/general/Modal';
import Login from '../components/login/Login';
import Register from '../components/register/Register';


const LandingPage = () => {

  const [loginModal, setLoginModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);

  const handleLoginModal = () => {
    setLoginModal(!loginModal);
    setRegisterModal(false);
    setResetModal(false);
  }

  const handleRegisterModal = () => {
    setRegisterModal(!registerModal);
    setLoginModal(false);
    setResetModal(false);
  }

  const handleResetModal = () => {
    setResetModal(!resetModal);
    setLoginModal(false);
    setRegisterModal(false);
  }

  return (
    <>
    <div className='bg-cream h-screen overflow-y-invisible'>
      <nav className="w-full flex items-center justify-between px-3 py-1.5">
        <div className='flex items-center text-sky-500 space-x-2'>
            <FaFacebookMessenger className='text-lg sm:text-lg md:text-2xl lg:text-4xl'/>
            <span className='text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 '>Vestnik</span>
        </div>
        <div className='flex items-center space-x-5'>
            <span className='hidden md:block'>Privacy policy</span>
            <span className='hidden md:block '>Terms of service</span>
            <span className='hidden md:block'>About</span>
            <button className='px-2 py-1 sm:px-3 sm:py-1.5 bg-sky-300 text-white font-semibold border border-dark-blue rounded-full  text-sm sm:text-lg md:text-xl lg:text-2xl hover:opacity-90' onClick={handleLoginModal}>
                Log in
            </button>
            <button className='px-2 py-1 sm:px-3 sm:py-1.5 bg-sky-500 text-white font-semibold border border-dark-blue rounded-full  text-sm sm:text-lg md:text-xl lg:text-2xl hover:opacity-90' onClick={handleRegisterModal}>
                Register
            </button>
        </div>
      </nav>
      <main className='relative w-full flex flex-col items-center md:items-start mt-10 px-4 md:px-8 lg:px-16'>
            <h3 className='flex flex-col items-center sm:items-start text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold'>
              <p>You can chat</p>
              <span className='inline-block whitespace-nowrap overflow-hidden animate-typewriter border-r border-black'>anywhere, anytime</span>
            </h3>
            <p className='mt-5'>Stay connected with ease, wherever you are - chat anytime, anywhere, effortlessly engage in conversation</p>
            <button className='mt-5 px-3 py-1.5 flex items-center border border-dark-blue text-white rounded-full bg-gradient-to-t from-sky-500 to-sky-300 hover:opacity-90' onClick={handleRegisterModal}>
                <PiMessengerLogoLight className='text-lg sm:text-2xl md:text-3xl lg:text-4xl mr-1.5'/>
               <span className='text-md sm:text-lg md:text-xl lg:text-2xl'>Give Vestnik a try</span>
            </button>
            <figure className='z-[25] fixed bottom-0 md:right-0 w-[100%] h-[40%] sm:w-[50%] sm:h-[50%]'>
              <img src={LayingDoodle} alt='woman holding phone doodle' className='h-full w-full object-fill'/>
            </figure>
      </main>
      <footer>
        <svg xmlns="http://www.w3.org/2000/svg" className='fixed bottom-0' viewBox="0 0 1440 320">
  <path fill="#0ea5e9" fillOpacity="1" d="M0,192L80,165.3C160,139,320,85,480,96C640,107,800,181,960,181.3C1120,181,1280,107,1360,69.3L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
</svg>
      </footer>
    </div>
    <Modal isVisible={loginModal}>
        <Login handleLoginModal={handleLoginModal} handleRegisterModal={handleRegisterModal}/>
    </Modal>
    <Modal isVisible={registerModal} >
        <Register handleRegisterModal={handleRegisterModal} handleLoginModal={handleLoginModal}/>
    </Modal>
    <Modal isVisible={resetModal}>
        <span onClick={handleResetModal}>Reset password</span>
    </Modal>
    </>
  )
}

export default LandingPage