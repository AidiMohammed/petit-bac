import React,{Fragment,useEffect,useContext,useState} from 'react'
import {firebaseContexte} from "../Firebase/"
import FindUser from '../modals/findUser'

function UserSpace(props) 
{
    const firebase = useContext(firebaseContexte)
    const [userSession, setUserSession] = useState(null)
    const [userAuth, setUserAuth] = useState(null)
    const [openModalSearchUser, setOpenModalSearchUser] = useState(false)

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

    const hidenModalSerachUser = () => setOpenModalSearchUser(false)

    return userAuth === null ?
        <Fragment>
            <h1>Chargement ...</h1>
        </Fragment>
        :
        <Fragment>
            <h2>Espace utilisateur : {userAuth.username}</h2>
            <br />
            <hr />
            <button onClick={() => firebase.signoutUser()}>Se Déconnécter</button>
            <br /><br />
            <button onClick={() => props.history.push("/profile")}>Mon Profile</button>
            <br />
            <button onClick={() => setOpenModalSearchUser(true)}>Trouver des utilisateurs </button>
            <br />
            <button>Commencer une parti</button>

            <FindUser showModelSearchUser={openModalSearchUser} hidenModal = {hidenModalSerachUser} userAuth={userAuth}/>
        </Fragment>

    
}

export default UserSpace
