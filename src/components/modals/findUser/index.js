import React,{Fragment,useContext,useEffect,useState} from 'react'
import {firebaseContexte} from '../../Firebase'
import './findUser.css'

function FindUser({showModelSearchUser,hidenModal,userAuth}) 
{

    const [stringSearch, setStringSearch] = useState("")
    const [usersFromDatabasse, setUsersFromDatabasse] = useState({})
    const [usersMatchStringSearch, setUsersMatchStringSearch] = useState({})
    const firebase = useContext(firebaseContexte)

    var usersNamesFromDatabasse = undefined;
    var usersIDFromDatabasse = undefined;

    useEffect(() => {
        console.log("user Auth name: ",userAuth.username)
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
                if(username.toUpperCase().includes(stringSearch.toUpperCase()))
                    usersMatch= {...usersMatch,[username]: usersFromDatabasse.usersIDFromDatabasse[index]}
         })
        setUsersMatchStringSearch(usersMatch)
    }

    const listUserMatch = () =>
    {
        const users = Object.keys(usersMatchStringSearch)
        return <Fragment>
            <br /><br /><br /><hr />
            <ul>
                {console.log("USERS : ",users)}
                {users.map((user,index) => <Fragment><li key={index}>{user} <button >Envoyer invitation</button></li><br /></Fragment>)}
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
            <div className= "overlay">
                <div className="warpper">
                    <h2>Search user </h2>
                    <input type="search" name="searchUser" id="searchUser" value={stringSearch} onChange={e => startSearchString(e)}/>
                    <button onClick= {() => closeModal()}>Fermer</button>
                    {listUserMatch()}
                </div>
            </div>
        </Fragment>
    
}

export default FindUser
