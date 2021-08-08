import React,{useState,useContext,useEffect} from 'react';
import {firebaseContexte} from '../Firebase/'
import {Link} from 'react-router-dom';


function Login(props) 
{
    const firebase = useContext(firebaseContexte)
    

    useEffect(() => {
        let authState = firebase.auth.onAuthStateChanged(user => user &&  props.history.push('/userSpace'));
        return () => authState()
    }, [])

    const initialState = {
        email: "",
        password: "123456",
        error: "" 
    }
    const [infoLogin, setInfoLogin] = useState(initialState);

    const {email,password,error} = infoLogin;
    
    const submitForm = (e) =>
    {
        e.preventDefault()
        firebase.loginUser(email,password)
        .then(user => {
            props.history.push("/userSapce")
           // props.history.push("/test")
        })
        .catch(err => setInfoLogin({...infoLogin,error: err.message}))
    }


    const messageError = error && <h1>{error}</h1>

    return (
        <div>
            <h1>Connexion</h1>
            <form onSubmit = {e => submitForm(e)}>

                <label htmlFor="email">Email :</label>
                <input value = {infoLogin.email} onChange = { e => setInfoLogin({...infoLogin,[e.target.name]: e.target.value})} type="text" name= "email"/>

                <label htmlFor="password">Mot de Passe :</label>
                <input value = {infoLogin.password} onChange = {e => setInfoLogin({...infoLogin,[e.target.name]: e.target.value})} type="password" name= "password"/>

                <button type='submit'>Connexion</button>
                <Link to ="/forgetPassword">mot de passe oublié ?</Link> 
            </form>
            {messageError}
            <Link to ="/signup"><h3>Vous étes nouveau ici ? Inscrivez-vous maintenant.</h3></Link>
        </div>
    )
}

export default Login
