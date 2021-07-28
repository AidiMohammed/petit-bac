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

        //cleanup
        return () => {
            listner()
        }
    }, [userSession])


    const hadelSignout =() =>//ne pas oublier de mettre le champ "online" à false dans la base de donné
    {
        firebase.signoutUser();
        setUserSession(null);
        setUserData(null);
    } 

    const AddToListInvitationSents = (user) =>
    {
        console.log(`user select : ${user.id} user auth id : ${userData}`);
        firebase.user(userSession.uid)
        .set({invitationSents: [user.id]})
        .then(() => console.log("***************"))
        .catch(err => console.log(err.message))
    }

    return userSession === null ? 
    <Fragment>
        <div>Loding ...</div>
    </Fragment>
    :
    <Fragment>
        <div> <h1>Profile</h1> <h4>Nom d'utilisateur : {userData.username}</h4> </div>
        <div>list des utilisateurs : 
            {users.map((user,index) => 
            {
                if(user.id !== userSession.uid)
                    return <Fragment key = {index}>
                        {console.log(`user id ${user.id} auth id ${userSession.uid}`)}
                        <h4>name : {user.data().username}</h4>
                        <button onClick = {() => AddToListInvitationSents(user)}>Ajouter </button>
                    </Fragment>
            })}
        </div>
        <button onClick= {() => hadelSignout()} type="button">Se deconnecter</button>
    </Fragment>
}

export default Profile
