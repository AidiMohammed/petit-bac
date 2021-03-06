import React,{useState,useContext} from 'react'
import { firebaseContexte } from '../Firebase'
import {Link} from 'react-router-dom'

function Signup(props) 
{
    const firebase = useContext(firebaseContexte)

    const initialState = {
        username: "",
        email: "",
        password: "123456",
        confirmPassword: "123456",
        error: ""
    }
    const [userInfo, setUserInfo] = useState(initialState);
    const {username,email,password,confirmPassword,error} = userInfo
    const setInput = e => setUserInfo({...userInfo,[e.target.name]: e.target.value})

    var userNameExist = false;
    
    const handelSubmit = e =>
    {
        e.preventDefault()
        if(password !== confirmPassword)
        {
            setUserInfo({...userInfo,error: "Les mots de passe saisis ne sont pas identiques"});
            return;
        }
       firebase.usersNames()
       .get()
       .then(doc => {
           if(doc && doc.exists)
           {
            const usersnamesfromdb = Object.keys(doc.data().usersnames)
            const usersID = Object.values(doc.data().usersnames)

            console.log("user name from db : ",usersnamesfromdb.length)

               if(usersnamesfromdb.length === 0)
               {
                   firebase.signupUser(email,password)
                   .then(user => {
                    firebase.user(user.user.uid)
                    .set({
                        username,
                        email,
                        firstname: "",
                        lastname: "",
                        phonemobile: "",
                        listcontactes: [],
                        blacklist: [],
                        avatarpath: "",
                        gender: "",
                        datebirth: ""
                    })
                    .then(() => {
                        firebase.usersNames()
                        .set({usersnames: {[username]: user.user.uid}})
                        .then(() => {
                            console.log("créer le premier utilisateur")
                            props.history.push("/userSpace")
                            return;
                        })
                        .catch(err => {setUserInfo({...userInfo,error: err.message});return})
                    })
                    .catch(err => {setUserInfo({...userInfo,error: err.message});return})
                   })
                   .catch(err => {setUserInfo({...userInfo,error: err.message});return})
               }

               usersnamesfromdb.forEach(userName => 
                {
                    if(username.toUpperCase() === userName.toUpperCase())
                    {
                        setUserInfo({...userInfo,error: `le nom d'utilisateur existe déja voulez choisir un autre nom d'utulisateur`})
                        userNameExist = true;
                        return;
                    }
               });
            
               if(!userNameExist)
                    firebase.signupUser(email,password)
                    .then(user => {
                        firebase.user(user.user.uid)
                        .set({
                                username,
                                email,
                                firstname: "",
                                lastname: "",
                                phonemobile: "",
                                listcontactes: [],
                                blacklist: [],
                                avatarpath: "",
                                gender: "",
                                datebirth: ""
                        })
                        .then(() => {
                            firebase.usersNames()
                            .set({usersnames: {...doc.data().usersnames,[username]: user.user.uid}})
                            .then(() => {
                                console.log("créer un utilisateur");
                                props.history.push("/userSpace")
                                return;
                                }).catch(err => setUserInfo({...userInfo,error: err.message}))
                        }).catch(err => setUserInfo({...userInfo,error: err.message}))
                    }).catch(err => setUserInfo({...userInfo,error: err.message}))
           }
       })
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
