import React,{useState,Fragment,useEffect,useContext} from 'react'
import firebaseContext from '../Firebase/context'

function Profile(props) 
{
    const [userSession, setUserSession] = useState(null)
    const [userData, setUserData] = useState({})
    const [users, setUsers] = useState([])

    const firebase = useContext(firebaseContext)
    
    useEffect(() => {
        let listner = firebase.auth.onAuthStateChanged(user => 
        {
            user ? setUserSession(user) : props.history.push('/login')
        })

        console.log("USER SESSION :  ",userSession)

        if(!!userSession)
        {
            firebase.user(userSession.uid)
            .get()
            .then( doc => {
                if(doc && doc.exists)
                    setUserData(doc.data())
            })
            .catch(err => console.error(err.message))    
            
            firebase.users()
            .get()
            .then(users => setUsers(users.docs))
            .catch(err => console.error(err.message))
        }
        
        

        return () => {
            listner()
        }
    }, [userSession])

    const hadelSignout =() =>
    {
        firebase.signoutUser();
        setUserSession(null);
        setUserData(null);
    } 

    return userSession === null ? 
    <Fragment>
        <div>Loding ...</div>
    </Fragment>
    :
    <Fragment>
        {console.log("USER DATA : ",userData)}
        <div> <h1>Profile</h1> <h4>Nom d'utilisateur : {userData.username}</h4> </div>
        <div>list des utilisateurs : 
            {users.map(user => <h4>name : {user.data().username}</h4>)}
        </div>
        <button onClick= {() => hadelSignout()} type="button">Se deconnecter</button>
    </Fragment>
}

export default Profile
