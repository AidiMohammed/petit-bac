import React,{useState,Fragment,useEffect,useContext} from 'react'
import firebaseContext from '../Firebase/context'

function Profile(props) 
{
    const [userSession, setUserSession] = useState(null)

    const firebase = useContext(firebaseContext)
    
    useEffect(() => {
        let listner = firebase.auth.onAuthStateChanged(user => {
            user ? setUserSession(user) : props.history.push('/login')
        })
        return () => {
            listner()
        }
    }, [])

    return userSession === null ? 
    <Fragment>
        <div>Loding ...</div>
    </Fragment>
    :
    <Fragment>
        <div> Profile </div>
        <button onClick= {() => firebase.signoutUser()} type="button">Se deconnecter</button>
    </Fragment>
}

export default Profile
