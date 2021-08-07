import React,{Fragment,useContext,useEffect,useState} from 'react'
import {firebaseContexte} from '../../Firebase'
import './findUser.css'

function FindUser() 
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

                console.log("user names from data basse : ",usersFromDatabasse," | ",usersNamesFromDatabasse)
            }
        })
    }, [])

    const startSearchString = e =>
    {
        setStringSearch(e.target.value)
        setUsersMatchStringSearch({})
        
        usersFromDatabasse.usersNamesFromDatabasse.forEach((username,index) => 
        {
            if(stringSearch.length > 1)
                if(username.includes(stringSearch))
                    setUsersMatchStringSearch({...usersMatchStringSearch,[username]: usersFromDatabasse.usersIDFromDatabasse[index]})
        })
        console.log("user find : ",usersMatchStringSearch)
    }

    const listUserMatch = () =>
    {
        const users = Object.keys(usersMatchStringSearch)
        return <Fragment>
            <br /><br /><br /><hr />
            <ul>
                
                {console.log("USERS : ",users)}
                {users.map(user => <li>{user} <button>Envoyer invitation</button></li>)}
            </ul>
        </Fragment>
    }

    return (
        <Fragment>
            <div className= "overlay">
                <div className="warpper">
                    <h2>Search user </h2>
                   <input type="search" name="searchUser" id="searchUser" value={stringSearch} onChange={e => startSearchString(e)}/>
                    {listUserMatch()}
                </div>
            </div>
        </Fragment>
    )
}

export default FindUser
