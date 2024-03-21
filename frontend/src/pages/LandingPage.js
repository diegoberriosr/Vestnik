import { useState } from 'react';

// Icon Imports
import { PiMessengerLogoLight } from "react-icons/pi";

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
    <div className='bg-cream'>
      <nav className="w-full h-14 shadow flex items-center justify-between px-10">
        <div className='flex items-center text-lg font-bold text-dark-salmon'>
            <PiMessengerLogoLight className='text-4xl'/>
            <span>Vestnik</span>
        </div>
        <div className='flex items-center space-x-5'>
            <span>About</span>
            <button className='px-2.5 py-0.5 bg-salmon font-bold border border-black rounded-full hover:opacity-90' onClick={handleLoginModal}>
                Log in
            </button>
            <button className='px-2.5 py-0.5 bg-dark-salmon font-bold border border-black rounded-full hover:opacity-90' onClick={handleRegisterModal}>
                Register
            </button>
        </div>
      </nav>
      <main className='w-full h-[calc(100vh-56px)] flex-col-reverse flex items-center md:flex-row  px-10'>
        <div className='w-6/12 h-full md:py-32'>
            <h3 className='sm:text-4xl md:text-6xl font-bold'>You can chat anywhere, anytime</h3>
            <p className='mt-5'>Нет никого, кто любил бы боль саму по себе, кто искал бы её и кто хотел бы иметь её просто потому, что это боль..</p>
            <button className='mt-5 py-1 px-5 flex items-center border border-black text-white rounded-full text-xl bg-gradient-to-t from-dark-salmon to-salmon hover:opacity-90' onClick={handleRegisterModal}>
                <PiMessengerLogoLight className='text-3xl mr-1.5'/>
                Give Vestnik a try
            </button>
            <div className='flex mt-5 space-x-5'>
                <button className='flex items-center bg-black border border-gray-500 py-1.5 px-5 rounded-lg text-white hover:opacity-90 cursor-not-allowed'>
                    <img src='https://freelogopng.com/images/all_img/1664285914google-play-logo-png.png' alt='google play store icon' width='30'/>
                    <div className='pl-2.5 flex flex-col items-start'>
                        <span className='text-xs'>GET IT ON</span>
                        <span className='font-bold'>Google Play</span>
                    </div>
                </button>
                <button className='flex items-center bg-black border border-gray-500 py-1.5 px-5 rounded-lg text-white hover:opacity-90 cursor-not-allowed'>
                    <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Apple_logo_white.svg/1200px-Apple_logo_white.svg.png' alt='google play store icon' width='30'/>
                    <div className='pl-2.5 flex flex-col items-start'>
                        <span className='text-xs'>Download on the </span>
                        <span className='font-bold'>Mac App Store</span>
                    </div>
                </button>
            </div>
        </div>
        <div className='w-6/12 h-full'>
            <img src='https://opendoodles.s3-us-west-1.amazonaws.com/laying.png' alt='woman holding phone doodle'/>
        </div>
      </main>
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
