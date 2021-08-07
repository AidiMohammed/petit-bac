import React,{Fragment,useEffect,useContext,useState} from 'react'
import {firebaseContexte} from "../Firebase/"
import FindUser from '../modals/findUser'

function UserSpace(props) 
{
    const firebase = useContext(firebaseContexte)
    const [userSession, setUserSession] = useState(null)
    const [userAuth, setUserAuth] = useState(null)
    useEffect(() => {
        const authState = firebase.auth.onAuthStateChanged(user => user ? setUserSession(user) : props.history.push('/login'));

        if(!!userSession)
        {
           firebase.user(userSession.uid)
           .get()
           .then(doc =>{
               if(doc && doc.exists)
                setUserAuth(doc.data())
           }).catch(err => console.log(err.message))
        }

        return () => authState()
    }, [userSession])

    return userAuth === null ?
        <Fragment>
            <h1>Chargement ...</h1>
        </Fragment>
        :
        <Fragment>
            <h2>Espace utilisateur</h2>
            <br />
            <hr />
            <button onClick={() => firebase.signoutUser()}>Se Déconnécter</button>
            <br /><br />
            <button onClick={() => props.history.push("/profile")}>Mon Profile</button>
            <br />
            <button>Trouver des utilisateurs </button>
            <br />
            <button>Commencer une parti</button>

            <FindUser />
        </Fragment>

    
}

export default UserSpace
