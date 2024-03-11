import {useState, createContext} from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext('')

export default AuthContext

export const AuthProvider = ({ children }) => {

    const [authTokens, setAuthTokens] = useState( localStorage.getItem('authTokens' ? localStorage.getItem('authTokens') : null));
    const [user, setUser] = useState( localStorage.getItem('user') ? localStorage.getItem('user') : null);

    const navigate = useNavigate();

    const loginUser = (data, setLoading, setAlertMessage) => {
        setLoading(true);
        axios({
            url : 'http://127.0.0.1:8000/api/token/',
            method : 'POST',
            data : { email : data.email , password : data.password}
        })
        .then( res => {
            setAuthTokens(res.data);
            localStorage.setItem('authTokens', JSON.stringify(data));
            setUser(jwtDecode(res.data.access));
            setLoading(false);
            navigate('/home');
        })
        .catch( err => {
            console.log(err);
            setLoading(false);
            setAlertMessage('Invalid login credentials');
        })
    }

    const values = {
        authTokens:authTokens,
        user:user,
        loginUser:loginUser
    };

    return <AuthContext.Provider value={values}>
        {children}
    </AuthContext.Provider>
}