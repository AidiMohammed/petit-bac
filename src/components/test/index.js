import React,{useContext,useEffect,useState,Fragment} from 'react'
import firebaseContext from '../Firebase/context'

/*
    les amélioration à faire:
    ajouter un champ invitations reçue pour ne pas écrir dans un autre user
    les régles de sécurité des la base de donnée
    amélioré les méthodes (ajouter à liste d'invitation)(accépter invitation)

*/

function Test(props) 
{
    const initCorrespondence = {
        userAuth: [],//accepter | réfuser
        authUser: [],//invitation envoyée 
        notCorrespondence: [],//Ajouter
        blackList: []

    }
    const initUserAuth = {
        theUser: {},
        dataUser: {}
    }
    const firebase = useContext(firebaseContext)
    const [userSession, setUserSession] = useState(null)
    const [userAuth, setUserAuth] = useState(initUserAuth)
    const [users, setUsers] = useState([])
    const [correspondence, setCorrespondence] = useState(initCorrespondence)
    const [updateStatUsers, setUpdateStatUsers] = useState(false)

    useEffect(() => 
    {
        let listner = firebase.auth.onAuthStateChanged(user => user ? setUserSession(user) : props.history.push('/login'))

        if(!!userSession)
        {
            var fromUser = {};
            var fromDataUser = {};

            firebase.user(userSession.uid)
            .get()
            .then(doc => {
                if(doc && doc.exists)
                    fromUser = doc.data();
            })
            .catch(err => console.error("(0) err",err.message))

            firebase.user(userSession.uid).collection("private").doc("dataUser")
            .get()
            .then(doc => {
                if(doc && doc.exists)
                    fromDataUser = doc.data()
                setUserAuth({theUser: fromUser,dataUser: fromDataUser})
            }).catch(err => console.error(err.message))

            
        }
        return () => {
            listner()
        }//cleanup
    }, [userSession])

    useEffect(() => {
        if(!!userSession && userAuth)
        {
            let newListUserToAuth = new Set();
            let newListAuthToUser = new Set();
            let newListNotCorrespondence = new Set();
            let newBlackList = new Set();
            let listContactes = new Set();

            firebase.users().where("invitationSent","array-contains",userSession.uid)
            .get()
            .then(users => users.forEach(doc => newListUserToAuth.add(doc.id)))
            .catch(err => console.error("(1) err",err.message))

            userAuth.theUser.invitationSent.forEach(item => newListAuthToUser.add(item));
            userAuth.dataUser.contactes.forEach(item => listContactes.add(item));
            userAuth.dataUser.blackListContactes.forEach(item => newBlackList.add(item))

            firebase.users()
            .get()
            .then(users => users.docs.map(user => 
                {
                    if(!newListUserToAuth.has(user.id))
                        if(!newListAuthToUser.has(user.id))
                            if(!listContactes.has(user.id))
                                if(!newBlackList.has(user.id))
                                    newListNotCorrespondence.add(user.id)
                }))
            .catch(err => console.error("(2) err",err.message))
            setCorrespondence({userAuth: newListUserToAuth,authUser: newListAuthToUser,notCorrespondence: newListNotCorrespondence,blackList: newBlackList})
        }

        firebase.users()
        .get()
        .then(users => {
            setUsers(users.docs)
        })
        .catch(err => console.error(err.message))

    }, [updateStatUsers,userAuth])

    const getInfo = () => 
    {
        console.log("correspondence : ",correspondence)
        console.info("auth user",userAuth)
    }

    const hadelSignout =() =>//ne pas oublier de mettre le champ "online" à false dans la base de donné
    {
        firebase.signoutUser();
        setUserSession(null);
        setUserAuth(null);
    } 

    const AddToListInvitationSents = (user) =>//il faut optimiser cette methode
    {
        firebase.user(userSession.uid)
        .get()
        .then(doc => 
            {
                if(doc && doc.exists)
                    setUserAuth({...userAuth,theUser: doc.data()})
            })
        .catch(err => console.error(err.message))

        console.log("user Auth : ",userAuth.theUser,userSession.uid)

        firebase.updateUser(userSession.uid)
        .update({invitationSent: [...userAuth.theUser.invitationSent,user.id]})
        .then(() => console.log("update !!"))
        .catch(err => console.error(err.message))

        setUpdateStatUsers(!updateStatUsers)
    }

    const acceptInvitation = (user) =>//il faut optimiser cette methode
    {

        firebase.user(userSession.uid).collection("private").doc("dataUser")
        .update({contactes: [...userAuth.dataUser.contactes,user.id]})
        .then(() => console.info("invitation accépter"))
        .catch(err => console.error(err.message))

        firebase.user(user.id).collection("private").doc("dataUser")
        .get()
        .then(doc => {
            if(doc && doc.exists)
            {
                console.log("DOC data : ",doc.data())
                let newListContactes = {contactes: [...doc.data().contactes,userSession.uid]}
                let newListInvitation = {invitationSent: doc.data().invitationSent.filter(user => user !== userSession.uid)}

                firebase.user(doc.id)
                .set(newListContactes,{merge: true})
                .then(() => {
                    firebase.user(doc.id)
                    .set(newListInvitation,{merge: true})
                    .then(() => console.log("invitation accépter et ajouter"))
                    .catch(err => console.log(err.message))
                })
                .catch(err => console.error(err.message))
            }
        })
    }

    const cancelinvitation = user =>
    {
        firebase.user(user.id)
        .get()
        .then(doc => {
            if(doc && doc.exists)
            {
                const newListInvitation = {invitationSent: doc.data().invitationSent.filter(user => user !== userSession.uid)}

                firebase.user(user.id)
                .set(newListInvitation,{merge: true})
                .then(() => console.info("invitation réfuser"))
                .catch(err => console(err.message))
            }
        })
    }

    const moveToBlacklist = user =>
    {
        firebase.user(userSession.uid)
        .get()
        .then(doc => {
            if(doc && doc.exists)
            {
                const newListContactes = {contactes: doc.data().contactes.filter(theUser => theUser !== user.id)}

                firebase.user(userSession.uid)
                .set(newListContactes,{merge: true})
                .then(() => {
                    console.log("delet user to list contacts OK!")
                    firebase.user(userSession.uid)
                    .set({blackListContactes: [...doc.data().blackListContactes,user.id]},{merge: true})
                    .then(() => console.log("utilisateur bloquer avec succès"))
                })
            }
        })
    }

    return userAuth === null ?
    <div>Loding ...</div> 
    : 
        <div>
            <h1>TEST </h1>
            <h4>name : {userAuth.theUser.username}</h4>
            <button onClick= {() => hadelSignout()} type="button">Se deconnecter</button>
            <button onClick= {() => getInfo()} type="button">get info</button>

            <div>
                <h4>list users :</h4>
                    {
                        users.map(user => 
                            {
                                const listUserToAuth = new Set(correspondence.userAuth);
                                const listAuthToUser = new Set(correspondence.authUser);
                                const listNotCorrespondence = new Set(correspondence.notCorrespondence);
                                const listContactes = new Set(userAuth.contactes);
                                const theBlackList = new Set(correspondence.blackList)

                                if(user.id != userSession.uid || theBlackList.has(user.id))
                                {
                                    if(listAuthToUser.has(user.id))
                                        return <h4>name : {user.data().username} invitation envoyée</h4>//si user auth a envoiyer une invitation
                                    if(listContactes.has(user.id))
                                        return <Fragment> 
                                                    <h4>name : {user.data().username} un contact</h4>
                                                    <button onClick={() => moveToBlacklist(user)}>Bloquer</button>
                                                </Fragment>
                                    if(listNotCorrespondence.has(user.id))
                                        return <Fragment>
                                                    <h4>name : {user.data().username} </h4>
                                                    <button onClick = {() => AddToListInvitationSents(user)}>Ajouter</button>
                                                </Fragment>
                                    if(listUserToAuth.has(user.id))//si user à envoiyer une invitation à user auth
                                    return <Fragment>
                                                <h4>name : {user.data().username} </h4> 
                                                <button onClick= {() => acceptInvitation(user)}>Accépter</button>
                                                <button onClick = {() => cancelinvitation(user)}>Réfuser</button>
                                            </Fragment>
                                }
                    })}
            </div>
        </div>
}

export default Test
