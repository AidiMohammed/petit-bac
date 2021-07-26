import React,{useState,useContext} from 'react';
import {firebaseContexte} from '../Firebase/'
import {Link} from 'react-router-dom';


function Login() 
{
    /*const firbase = useContext(firebaseContexte)*/

    const initialState = {
        email: "",
        password: "",
        error: "" 
    }
    const [infoLogin, setInfoLogin] = useState(initialState);

    const submitForm = (e) =>
    {
        e.preventDefault()
        console.log(infoLogin)
    }

    return (
        <div>
            <h1>Connexion</h1>
            <form onSubmit = {e => submitForm(e)}>

                <label htmlFor="email">Email :</label>
                <input value = {infoLogin.email} onChange = { e => setInfoLogin({...infoLogin,[e.target.name]: e.target.value})} type="text" name= "email"/>

                <label htmlFor="password">Mot de Passe :</label>
                <input value = {infoLogin.password} onChange = {e => setInfoLogin({...infoLogin,[e.target.name]: e.target.value})} type="password" name= "password"/>

                <button type='submit'>Connexion</button>
            </form>
            <Link to ="/signup"><h3>Vous étes nouveau ici ? Inscrivez-vous maintenant.</h3></Link>
        </div>
    )
}

export default Login
