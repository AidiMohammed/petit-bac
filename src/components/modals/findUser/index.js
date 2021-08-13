import React,{Fragment,useContext,useEffect,useState} from 'react'
import {firebaseContexte} from '../../Firebase'
import UserSearchResult from '../../helpers/UserSearchResult'
import './findUser.css'

function FindUser({showModelSearchUser,hidenModal,userAuth,idUserAuth}) 
{

    const [stringSearch, setStringSearch] = useState("")
    const [usersFromDatabasse, setUsersFromDatabasse] = useState({})
    const [usersMatchStringSearch, setUsersMatchStringSearch] = useState({})
    const [usersIssuingInvitations, setUsersIssuingInvitations] = useState({})
    const firebase = useContext(firebaseContexte)

    var usersNamesFromDatabasse = undefined;
    var usersIDFromDatabasse = undefined;

    useEffect(() => 
    {
        firebase.usersNames()
        .get()
        .then(doc => {
            if(doc && doc.exists)
            {
                usersNamesFromDatabasse = Object.keys(doc.data().usersnames)
                usersIDFromDatabasse = Object.values(doc.data().usersnames)
                setUsersFromDatabasse({usersNamesFromDatabasse,usersIDFromDatabasse})
            }
        }).catch(err => console.error(err.messae))

        firebase.creatNotification("invitations")
        .onSnapshot((doc) => 
        {
            if(doc && doc.exists)
                for(let user_id in doc.data().invitationReceived)
                    if(user_id == idUserAuth)
                        setUsersIssuingInvitations(doc.data().invitationReceived[user_id])
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
                    <UserSearchResult 
                        usersMatch = {usersMatchStringSearch} 
                        usersIssuingInvitations = {usersIssuingInvitations} 
                        usersMatchStringSearch={usersMatchStringSearch}
                        idUserAuth={idUserAuth}
                        userAuth={userAuth}
                    />
                </div>
            </div>
        </Fragment>
    
}

export default FindUser
