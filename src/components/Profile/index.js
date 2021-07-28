import React,{useState,Fragment,useEffect,useContext} from 'react'
import firebaseContext from '../Firebase/context'

function Profile(props) 
{
    const [userSession, setUserSession] = useState(null)
    const [userData, setUserData] = useState({})
    const [users, setUsers] = useState([])
    const [updateStatUsers, setUpdateStatUsers] = useState(false)

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
    }, [userSession,updateStatUsers])


    const hadelSignout =() =>//ne pas oublier de mettre le champ "online" à false dans la base de donné
    {
        firebase.signoutUser();
        setUserSession(null);
        setUserData(null);
    } 

    const AddToListInvitationSents = (user) =>
    {
        firebase.user(userSession.uid)
        .get()
        .then(doc => 
            {
                if(doc && doc.exists)
                    setUserData(doc.data())

                firebase.users()
                    .get()
                    .then(users => {
                        setUsers(users.docs)
                        setUpdateStatUsers(!updateStatUsers)
                    } )
                    .catch(err => console.error(err.message))
            })
        .catch(err => console.error(err.message))

        firebase.user(userSession.uid)//pour pointer sur user auth
        .set({invitationSents: [...userData.invitationSents,user.id]},{ merge: true })//ajouter id de l'utilisateur à la liste d'invitation envoyée de user auth
        .then(() => firebase.user(user.id)//pour pointer sur user sélectionner
            .set({invitationReceived: [...user.data().invitationReceived,userSession.uid]},{merge: true})
            .then(() => console.info("invitation envoyée avec succès"))
            .catch(err => console.error(err.message))
        )
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
                //forEach
                console.log(`user auth ${userData.invitationSents} autre user ${user.data().invitationReceived}`)
                if(user.id !== userSession.uid)
                    return (
                    <Fragment key = {index}>
                        <h4>name : {user.data().username}</h4>
                        {
                            user.data().invitationReceived.map(item => (item !== userSession.uid) ? <button onClick = {() => AddToListInvitationSents(user)}>Ajouter </button> : <h4>invitation envoyée</h4>)
                            //user.data().invitationReceived.map(item => console.log(`ather user ${item} user auth ${userSession.uid}`))
                            //console.log(user.data().invitationReceived.length)
                        }
                        {
                            user.data().invitationReceived.length === 0 && <button onClick = {() => AddToListInvitationSents(user)}>Ajouter </button>
                        }
                    </Fragment>)
            })}
        </div>
        <button onClick= {() => hadelSignout()} type="button">Se deconnecter</button>
    </Fragment>
}

export default Profile
