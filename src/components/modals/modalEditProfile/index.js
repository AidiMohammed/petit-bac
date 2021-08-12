import React,{Fragment,useState,useEffect,useContext} from 'react'
import './modalEditProfil.css'
import {firebaseContexte} from '../../Firebase'
import firebaseContext from '../../Firebase/context'

function ModelEditProfile({showModal,hidenModal,userData,userID})
 {

    const initialState = {
        firstname: userData.firstname,
        lastname: userData.lastname,
        phonemobile: userData.phonemobile,
        gender: userData.gender,
        datebirth: userData.datebirth
    }
    const [profileUser, setProfileUser] = useState(initialState)
    const firebase = useContext(firebaseContext);

    const inputChange = e => 
    {
        console.log(e.target.value)
        setProfileUser({...profileUser,[e.target.name]: e.target.value})
    } 

    const handelSubmit = e =>
    {
        e.preventDefault();
        console.log(e);

        firebase.user(userID)
        .update({
                firstname: profileUser.firstname,
                lastname: profileUser.lastname,
                phonemobile: profileUser.phonemobile,
                gender: profileUser.gender,
                datebirth: profileUser.datebirth
            })
        .then(() =>{
            console.log("up date profile")
            hidenModal();
        })
        .catch(err => console.error(err.message))
    }
    return showModal &&
        <Fragment>
            <div className= "overlay-edit-profile">
                <div className="warpper-edit-profile">
                    <h2>Modifer profile</h2>
                    <button onClick={hidenModal}>Annuler</button>
                    <form onSubmit={e => handelSubmit(e)}>
                        <h2>profile</h2>
                        <label htmlFor="firstname">Prénom :</label>
                        <input onChange={e => inputChange(e)}  type="text" name="firstname" id="firstname" value={profileUser.firstname} />
                        <br />
                        <br />
                        <label htmlFor="lastname">Nom de famille :</label>
                        <input onChange={e => inputChange(e)} type="text" name="lastname" id="lastname" value={profileUser.lastname} />
                        <br />
                        <br />
                        <label htmlFor="phonemobile">Numéro de téléphone :</label>
                        <input onChange={e => inputChange(e)} type="text" name="phonemobile" id="phonemobile" value={profileUser.phonemobile} />
                        <br />
                        <br />
                        <label htmlFor="gender">Gender :</label>
                        <input onChange={e => inputChange(e)} type="text" name="gender" id="gender" value={profileUser.gender} />
                        <br />
                        <br />
                        <label htmlFor="datebirth">Date de naissance :</label>
                        <input onChange={e => inputChange(e)} type="date" name="datebirth" id="datebirth" value={profileUser.datebirth} />
                        <hr />
                        <br />
                        <button type ="submit">Enregistrer les modifications </button>
                    </form>
                </div>
            </div>
        </Fragment>
}

export default ModelEditProfile
