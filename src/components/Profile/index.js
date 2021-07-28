import React,{useState,Fragment,useEffect,useContext} from 'react'
import firebaseContext from '../Firebase/context'

function Profile(props) 
{
    const [userSession, setUserSession] = useState(null)
    const [userAuth, setUserAuth] = useState({})
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
                    setUserAuth(doc.data())
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
        setUserAuth(null);
    } 

    const AddToListInvitationSents = (user) =>
    {
        firebase.user(userSession.uid)
        .get()
        .then(doc => 
            {
                if(doc && doc.exists)
                    setUserAuth(doc.data())

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
        .set({invitationSents: [...userAuth.invitationSents,user.id]},{ merge: true })//ajouter id de l'utilisateur à la liste d'invitation envoyée de user auth
        .then(() => console.info("invitation envoyée avec succès"))
        .catch(err => console.log(err.message))
    }

    return userSession === null ? 
    <div>Loding ...</div>
    :
    <Fragment>
        <div> <h1>Profile</h1> <h4>Nom d'utilisateur : {userAuth.username}</h4> </div>
        <div>list des utilisateurs : 
            {users.map((user,index) => 
            {
                if(user.id !== userSession.uid)
                    return (
                    <Fragment key = {index} >
                        <div style={{border: "1px solid red" ,display: "flex"}} className="user">
                            <h4 >name : {`${user.data().username} `}</h4>
                            {
                                user.data().invitationSents.map((userid,index) => 
                                {
                                    if(userid === userSession.uid)
                                        return <Fragment key={index}>{console.log("je suis la")}<button>Accépter</button> <button>Réfuser</button></Fragment>
                                    if(userid !== userSession.uid)
                                    {
                                        userAuth.invitationSents.map(item => {
                                            if(item === user.id)
                                            {
                                                console.log("je suis la (item) : ",item,"user id : ",user.id)
                                                return <h1>invitation envoiyée</h1>
                                            }
                                                
                                            else
                                                return <button onClick = {() => AddToListInvitationSents(user)}>Ajouter !!</button>
                                        })
                                    }
                                })
                            }
                            {(user.data().invitationSents.length === 0) && <button onClick = {() => AddToListInvitationSents(user)}>Ajouter !!</button>}
                        </div>
                    </Fragment>)
            })}
        </div>
        <button onClick= {() => hadelSignout()} type="button">Se deconnecter</button>
    </Fragment>
}

export default Profile
