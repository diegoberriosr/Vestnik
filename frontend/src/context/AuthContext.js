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
            url : 'https://vestnik.onrender.com/api/token/',
            method : 'POST',
            data : { email : data.email , password : data.password}
        })
        .then( res => {
  
            setAuthTokens(res.data);
            localStorage.setItem('authTokens', JSON.stringify(data));
            setUser(jwtDecode(res.data.access));

            axios({
                url : 'https://vestnik.onrender.com/login/status',
                method : 'PUT',
                headers : { 'Authorization' : 'Bearer ' + String(res.data.access)}
            })
            .then( () => {
                setLoading(false);
                navigate('/inbox');
            })
            .catch( err => {
                console.log(err);
                setLoading(false)
            });
        })
        .catch( err => {
            console.log(err);
            setLoading(false);
            setAlertMessage('Invalid login credentials');
        })
    }

    const registerUser = (data, setLoading, setAlertMessage) => {
        setLoading(true);
        axios({
            url : 'https://vestnik.onrender.com/register',
            method : 'POST',
            data : { email : data.email, name: data.name, password : data.password}
        })
        .then( () => 
            loginUser(data, setLoading, setAlertMessage)
        )
        .catch( err => {
            console.log(err);
            setLoading(false);
            setAlertMessage('An error ocurred during registration')
        })
    };


    const logoutUser = () => {
        axios({
            url : 'https://vestnik.onrender.com/login/status',
            method : 'PUT',
            headers : { 'Authorization' : 'Bearer ' + String(authTokens.access)}
        })
        .then( () => {
            setAuthTokens(null);
            setUser(null);
            localStorage.removeItem('authTokens');
            localStorage.removeItem('user');
            navigate('/login');
        }
        )
        .catch( err => {
            console.log(err);
        })
    };

    const values = {
        authTokens:authTokens,
        user:user,
        setUser:setUser,
        loginUser:loginUser,
        logoutUser:logoutUser,
        registerUser:registerUser
    };

    return <AuthContext.Provider value={values}>
        {children}
    </AuthContext.Provider>
}