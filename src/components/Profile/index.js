import React,{useState,Fragment,useEffect,useContext} from 'react'
import firebaseContext from '../Firebase/context'
import ModalEditProfile from '../modals/modalEditProfile'

function Profile(props) 
{
    const [userSession, setUserSession] = useState(null);
    const [dataUserAuth, setDataUserAuth] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const firebase = useContext(firebaseContext);

    useEffect(() => 
    {
        let authState = firebase.auth.onAuthStateChanged(user => user ? setUserSession(user) : props.history.push('/login'));

        if(!!userSession)
        {
            firebase.user(userSession.uid)
            .get()
            .then(doc => {
                if(doc && doc.exists)
                    setDataUserAuth(doc.data())
            })
            .catch()
        }
        return () => authState();
    }, [userSession])
    
    const hidenModalEditprofil = () => setOpenModal(false)
    

    return dataUserAuth === null ? 
        <Fragment>
            <h1>Chargement ...</h1>
        </Fragment>
        :
        <Fragment>
            <h2>profile</h2>
            <p>nom d'utilisateur: {dataUserAuth.username}</p>{/*remplacer button par Link  'react router dom'*/}
            <button onClick={() => props.history.push("/userSpace")}>Mon espace</button>
            <br />
            <br />
            <button onClick={() => firebase.signoutUser()}>Se Déconnécter</button>
            <br />
            <hr />
            <label htmlFor="firstname">Prénom :</label>
            <input type="text" name="firstname" id="firstname" value={dataUserAuth.firstname} disabled/>
            <br />
            <br />
            <label htmlFor="lastname">Nom de famille :</label>
            <input type="text" name="lastname" id="lastname" value={dataUserAuth.lastname} disabled/>
            <br />
            <br />
            <label htmlFor="email">Email :</label>
            <input type="text" name="email" id="email" value={dataUserAuth.email} disabled/>
            <br />
            <br />
            <label htmlFor="phonemobile">Numéro de téléphone :</label>
            <input type="text" name="phonemobile" id="phonemobile" value={dataUserAuth.phonemobile} disabled/>
            <br />
            <br />
            <label htmlFor="gender">Gender :</label>
            <input type="text" name="gender" id="gender" valus={dataUserAuth.gender} disabled/>
            <br />
            <br />
            <label htmlFor="datebirth">Date de naissance :</label>
            <input type="date" name="datebirth" id="datebirth" value={dataUserAuth.datebirth} disabled/>
            <hr />
            <br />
            <button onClick={() => setOpenModal(true)}>Modifier mon profile</button>

            <ModalEditProfile showModal ={openModal} hidenModal = {hidenModalEditprofil} userData = {dataUserAuth} userID = {userSession.uid}/>
        </Fragment>
    
}

export default Profile
