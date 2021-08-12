import React,{Fragment,useContext} from 'react'
import {firebaseContexte} from "../../Firebase"

function UserSearchResult({usersMatch,usersIssuingInvitations,usersMatchStringSearch,userAuth,idUserAuth}) 
{
    const firebase = useContext(firebaseContexte)
    const usersIdsMatching = Object.values(usersMatch)   
    const usersNamesMatching = Object.keys(usersMatch)

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
                        ObjectInvitationReceived[user_id] = newlist

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

    return <Fragment>
        <ul style = {{border: "solid 1px red"}}>
            {
                usersIdsMatching.map((user_id,index) => 
                {
                    console.log(usersIssuingInvitations.length)
                    if(usersIssuingInvitations.length > 0)
                    {
                     if(usersIssuingInvitations.indexOf(user_id) !== -1 )
                        return  <li>
                                    {usersNamesMatching[index]}
                                    <button>Accépter invitation</button>
                                    <button>Annuler invitation</button>
                                </li>
                    else
                        return  <li>
                                    {usersNamesMatching[index]}
                                    <button onClick ={() => sendInvitation(user_id,index)}>Envoyer invitation</button>
                                </li>                       
                    }
                    else
                    return  <li>
                                {usersNamesMatching[index]}
                                <button onClick ={() => sendInvitation(user_id,index)}>Envoyer invitation</button>
                            </li>      
                })
            }
        </ul>
    </Fragment>
}

export default UserSearchResult
