import { useState } from 'react';
import LayingDoodle from '../assets/LayingDoodle.png';
import DoogieDoodle from '../assets/DoogieDoodle.png';
import DogJumpDoodle from '../assets/DogJumpDoodle.png';
import LovingDoodle from '../assets/LovingDoodle.png';
import SelfieDoodle from '../assets/SelfieDoodle.png';
import DumpingDoodle from '../assets/DumpingDoodle.png';
import SitReadingDoodle from '../assets/SitReadingDoodle.png';
import ballet from '../assets/ballet.png';
import swinging from '../assets/swinging.png';
import clumsy from '../assets/clumsy.png';

// Icon Imports
import { PiMessengerLogoLight } from "react-icons/pi";
import { FaFacebookMessenger } from "react-icons/fa";

// Component imports
import Modal from '../components/general/Modal';
import Login from '../components/login/Login';
import Register from '../components/register/Register';
import PlaceholderMessage from '../components/messages/PlaceholderMessage';

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
      <nav className="w-full flex items-center justify-between px-1.5 sm:px-2.5 md:px-5 lg:px-10 py-5 text-xs sm:text-sm md:text-md lg:text-lg">
        <div className='flex items-center text-sm sm:text-md md:text-lg lg:text-xl font-bold text-sky-500 space-x-2'>
            <FaFacebookMessenger className='text-lg sm:text-lg md:text-2xl lg:text-4xl'/>
            <span className='text-gray-900'>Vestnik</span>
        </div>
        <div className='flex items-center space-x-5'>
            <span>Privacy policy</span>
            <span>Terms of service</span>
            <span>About</span>
            <button className='px-2.5 py-0.5 bg-sky-300 text-white font-semibold border border-dark-blue rounded-full hover:opacity-90' onClick={handleLoginModal}>
                Log in
            </button>
            <button className='px-2.5 py-0.5 bg-sky-500 text-white font-semibold border border-dark-blue rounded-full hover:opacity-90' onClick={handleRegisterModal}>
                Register
            </button>
        </div>
      </nav>
      <main className='relative w-full flex-col mt-10 px-4 md:px-8 lg:px-16'>
        <div className='absolute top-0 w-6/12 h-full'>
            <h3 className='text-lg sm:text-xl md:text-2xl lg:text-6xl font-bold'>
              <p>You can chat</p>
              <div className='w-[70%] whitespace-nowrap border-r border-black overflow-hidden animate-typewriter'>anywhere, anytime</div>
            </h3>
            <p className='mt-5'>Stay connected with ease, wherever you are - chat anytime, anywhere, effortlessly engage in conversation</p>
            <button className='mt-5 py-1 px-5 flex items-center border border-dark-blue text-white rounded-full text-xl bg-gradient-to-t from-sky-500 to-sky-300 hover:opacity-90' onClick={handleRegisterModal}>
                <PiMessengerLogoLight className='text-sm sm:text-md md:text-xl lg:text-3xl mr-1.5'/>
               <span className='text-xs sm:text-sm md:text'>Give Vestnik a try</span>
            </button>
        </div>
        <PlaceholderMessage animation='animate-float' position='left-[2.5%] top-80' pfp={DoogieDoodle} name='Luna' message='Hei!'/>
        <PlaceholderMessage animation='animate-float' position='left-[12.5%] top-72' pfp={DogJumpDoodle} name='Paco' message='Hallo!'/>
        <PlaceholderMessage animation='animate-float' position='left-[22%] top-64' pfp={clumsy} name='Arto' message='Terve!'/>
        <PlaceholderMessage animation='animate-float' position='left-[34%] top-64' pfp ={LovingDoodle} name='Юрий' message='Привет!' reverse/>
        <PlaceholderMessage animation='animate-float' position='left-[43%] top-80' pfp={SelfieDoodle} name='John' message='Hi!'/>
      </main>
      <footer>
        <img src={LayingDoodle} alt='woman holding phone doodle' className='z-[25] fixed -bottom-10 sm:-bottom-10 md:-bottom-20 lg:-bottom-40 right-0 w-6/12'/>
        <svg xmlns="http://www.w3.org/2000/svg" className='fixed bottom-0' viewBox="0 0 1440 320">
  <path fill="#0ea5e9" fill-opacity="1" d="M0,192L80,165.3C160,139,320,85,480,96C640,107,800,181,960,181.3C1120,181,1280,107,1360,69.3L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
</svg>
              <img src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png' width='200' className='fixed bottom-0 left-1 z-[40]'/>
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
