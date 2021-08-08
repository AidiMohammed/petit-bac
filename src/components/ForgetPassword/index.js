import React,{Fragment,useState,useContext,useEffect} from 'react'
import firebaseContext from '../Firebase/context';

function ForgetPassword(props) 
{
    const [state, setState] = useState({
        email: "",
        success: null,
        error: null
    });

    const {email,success,error} = state;

    const firebase = useContext(firebaseContext)

    const submitForm = (e) =>
    {
        e.preventDefault()
        firebase.passwordReset(email)
        .then(() => {
            setState({...state,error: null});
            setState({...state,success: "E-mail de réninitialisation de mot de passe envoyé"});
        })
        .catch(err => {
            console.error(err.message)
            setState({...state,error: err.message})
        })
    }

    const errorMessage = error && <h1>{error}</h1>

    return success !== null ? 
    <Fragment>
        <h1>{success}</h1>
    </Fragment>
    :
    <Fragment>
        <h1>Récupération de mot de passe</h1>
        {errorMessage}
        <form onSubmit = {e => submitForm(e)}>

            <label htmlFor="email">Email :</label>
            <input value = {email} onChange = { e => setState({...state,email: e.target.value})} type="email" name= "email" required/>
            <button type='submit'>Envoyer</button>
        </form>
        <br /><br /><hr />
        <button onClick={() => props.history.push("/userSapce")}>Se connecter </button>
    </Fragment>
     
}

export default ForgetPassword
