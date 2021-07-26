import React,{useState,useContext} from 'react';
import {firebaseContexte} from '../Firebase/'
import {Link} from 'react-router-dom';


function Login(props) 
{
    const firebase = useContext(firebaseContexte)

    const initialState = {
        email: "",
        password: "",
        error: "" 
    }
    const [infoLogin, setInfoLogin] = useState(initialState);

    const {email,password,error} = infoLogin;

    const submitForm = (e) =>
    {
        e.preventDefault()
        firebase.loginUser(email,password)
        .then(user => {
            console.log("USER : ",user)
            props.history.push("/profile")
        })
        .catch(err => setInfoLogin({...infoLogin,error: err.message}))

        console.log("INFO LOGIN : ",infoLogin)
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
