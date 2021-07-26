import React,{useState,Fragment,useEffect,useContext} from 'react'
import firebaseContext from '../Firebase/context'

function Profile(props) 
{
    const [userSession, setUserSession] = useState(null)
    const [userData, setUserData] = useState({})

    const firebase = useContext(firebaseContext)
    
    useEffect(() => {
        let listner = firebase.auth.onAuthStateChanged(user => 
        {
            user ? setUserSession(user) : props.history.push('/login')
        })

        if(!!userSession)
        {
            firebase.user(userSession.uid)
            .get()
            .then( doc => {
                if(doc && doc.exists)
                    setUserData(doc.data())
            })
            .catch(err => console.error(err.message))            
        }


        return () => {
            listner()
        }
    }, [userSession])

    return userSession === null ? 
    <Fragment>
        <div>Loding ...</div>
    </Fragment>
    :
    <Fragment>
        <div> <h1>Profile</h1> <h4>Nom d'utilisateur : {userData.username}</h4> </div>

        <button onClick= {() => firebase.signoutUser()} type="button">Se deconnecter</button>
    </Fragment>
}

export default Profile
