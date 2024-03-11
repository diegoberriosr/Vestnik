import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import LandingPage from './pages/LandingPage';
import MainPage from './pages/MainPage';

// Context provider imports
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<LandingPage/>} path='/login'/>
          <Route element={<MainPage/>} path='/*'/>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
