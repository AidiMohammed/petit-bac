import React,{useState,useContext} from 'react'
import { firebaseContexte } from '../Firebase'
import {Link} from 'react-router-dom'

function Signup(props) 
{
    const firebase = useContext(firebaseContexte)

    const initialState = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        error: ""
    }
    const [userInfo, setUserInfo] = useState(initialState);
    let userNameExiste = false

    const {username,email,password,confirmPassword,error} = userInfo

    const setInput = e => setUserInfo({...userInfo,[e.target.name]: e.target.value})
    
    const handelSubmit = e =>
    {
        e.preventDefault()

        if(password !== confirmPassword)
        {
            setUserInfo({...userInfo,error: "Les mots de passe saisis ne sont pas identiques"});
            return;
        }
        //console.log(users.docs[0].data()toUpperCase
        firebase.users()
        .get()
        .then(users => 
            {
                users.docs.map(user => 
                    {
                        console.log("user name ************************",user.data().username.toUpperCase())
                        if(user.data().username.toUpperCase() === username.toUpperCase())
                        {
                            userNameExiste = true;
                            setUserInfo({...userInfo,error: `Ce nom d'utilisateur ${username} existe déjà ! veuillez choisir un autre nom d'utilisateur`});
                        }  
                    })

                if(!userNameExiste)
                firebase.signupUser(email,password)
                .then(user => {
                    firebase.user(user.user.uid).set({
                        username,
                        email,
                        contactes: [],
                        firstName: "",
                        lastName: "",
                        phoneNumber: "",
                        dateBirth: "",
                        invitationSents: [],
                        invitationReceived: [],
                        score: 0,
                        onLine: true
                    })
                    setUserInfo(initialState);
                    props.history.push("/profile")
                })
                .catch(err => {
                    setUserInfo({...userInfo,error :`err (1) : ${err.message}`})
                })      
            })
        .catch(err => setUserInfo({...userInfo,error:`err (2) : ${err.message}`}))
    }

    const messageError = error && <h1>{error}</h1>

    return (
        <div>
            <h1>Inscription</h1>

            <form onSubmit={handelSubmit}>

                <label htmlFor="username">Nom d'utilisateur</label>
                <input onChange ={e => setInput(e)} type="text" name="username" value = {username}required/>

                <label htmlFor="email">Email</label>
                <input onChange ={e => setInput(e)} type="email" name="email" value = {email} required/>

                <label htmlFor="password">Mot de passe</label>
                <input onChange ={e => setInput(e)} type="password" name= "password" value = {password} required/>

                <label htmlFor="confirmPassword">Confirmer votre de passe</label>
                <input onChange ={e => setInput(e)} type="password" name= "confirmPassword" value = {confirmPassword} required/>

                <button type="submit">S'inscrire</button>

                <Link to ='/login'>vous êtes déjà membre connectez-vous</Link>

                {messageError}
            </form>
        </div>
    )
}

export default Signup;
