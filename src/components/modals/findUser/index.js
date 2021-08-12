import React,{Fragment,useContext,useEffect,useState} from 'react'
import {firebaseContexte} from '../../Firebase'
import './findUser.css'

function FindUser({showModelSearchUser,hidenModal,userAuth,idUserAuth}) 
{

    const [stringSearch, setStringSearch] = useState("")
    const [usersFromDatabasse, setUsersFromDatabasse] = useState({})
    const [usersMatchStringSearch, setUsersMatchStringSearch] = useState({})
    const firebase = useContext(firebaseContexte)

    var usersNamesFromDatabasse = undefined;
    var usersIDFromDatabasse = undefined;

    useEffect(() => {
        firebase.usersNames()
        .get()
        .then(doc => {
            if(doc && doc.exists)
            {
                usersNamesFromDatabasse = Object.keys(doc.data().usersnames)
                usersIDFromDatabasse = Object.values(doc.data().usersnames)
                setUsersFromDatabasse({usersNamesFromDatabasse,usersIDFromDatabasse})
            }
        })
    }, [])

    const startSearchString = e =>
    {
        setStringSearch(e.target.value)
        setUsersMatchStringSearch({})
        let usersMatch = {}
        
        usersFromDatabasse.usersNamesFromDatabasse.forEach((username,index) => 
        {
            if(stringSearch.length > 1)
                if(username.toUpperCase().includes(stringSearch.toUpperCase()) && username != userAuth.username)
                    usersMatch= {...usersMatch,[username]: usersFromDatabasse.usersIDFromDatabasse[index]}
         })
        setUsersMatchStringSearch(usersMatch)
    }
    const sendInvitation = (userNameReceivedInvitation,index) =>
    {
        const usersids = Object.values(usersMatchStringSearch);
        firebase.creatNotification("invitations")
        .get()
        .then(doc => {
            if(doc && doc.exists)
            {
                let createNewInvitationForUserReceivedInvitation = true;
                if(Object.values(doc.data().invitationReceived).length === 0)//creat the first object
                {
                    firebase.creatNotification("invitations")
                    .set({invitationReceived: {[usersids[index]]: [idUserAuth]}})
                    .then(() => console.info("creat oK !!"))
                    .catch(err => console.error(err.message))
                }

                for(let user_id in doc.data().invitationReceived)
                {
                    if(user_id == usersids[index])
                    {
                        createNewInvitationForUserReceivedInvitation = false;
                        const newlist = [...doc.data().invitationReceived[user_id],idUserAuth] 
                        const newobject = new Object()
                        newobject[user_id] = newlist;

                        const ObjectInvitationReceived = doc.data().invitationReceived
                        console.dir(doc.data().invitationReceived)
                        ObjectInvitationReceived[user_id] = newlist
                        console.log(ObjectInvitationReceived)

                       firebase.creatNotification('invitations')
                        .update({invitationReceived: ObjectInvitationReceived})
                        .then(() => console.info("update ",userNameReceivedInvitation," reacevid invitation from ",userAuth.username))
                    }
                }
                if(createNewInvitationForUserReceivedInvitation)
                {
                    firebase.creatNotification('invitations')
                    .set({invitationReceived: {...doc.data().invitationReceived,[usersids[index]]: [idUserAuth]}})
                }
            }
        })
        .catch(err => console.error("err (2): ",err.message))
    }

    const listUserMatch = () =>
    {
        const users = Object.keys(usersMatchStringSearch)
        return <Fragment>
            <br /><br /><br /><hr />
            <h2>Résulta</h2>
            <ul>
                {users.map((user,index) => <Fragment><li key={index}>{user} <button onClick ={() => sendInvitation(user,index)}>Envoyer invitation</button></li><br /></Fragment>)}
            </ul>
        </Fragment>
    }

    const closeModal = () =>
    {
        setStringSearch("");
        setUsersMatchStringSearch({})
        hidenModal();
    }

    return showModelSearchUser &&
        <Fragment>
            <div className= "overlay-find-user">
                <div className="warpper-find-user">
                    <h2>Search user </h2>
                    <input type="search" name="searchUser" id="searchUser" value={stringSearch} onChange={e => startSearchString(e)}/>
                    <button onClick= {() => closeModal()}>Fermer</button>
                    {listUserMatch()}
                </div>
            </div>
        </Fragment>
    
}

export default FindUser
