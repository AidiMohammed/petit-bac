import firebase from 'firebase/app';
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCIyq-SOZPmoaS_i6goI_91qLRinJLqTgM",
    authDomain: "magictoolreact.firebaseapp.com",
    projectId: "magictoolreact",
    storageBucket: "magictoolreact.appspot.com",
    messagingSenderId: "252981923118",
    appId: "1:252981923118:web:3d68021f8e824ee5c0febf"
  };

class Fairebase{
    constructor()
    {
        firebase.initializeApp(firebaseConfig)
        this.auth = firebase.auth();
    }

    //inscription

    signupUser = (email,password) => this.auth.createUserWithEmailAndPassword(email,password)
    
    //Connexion
    loginUser = (email,password) => this.auth.signInWithEmailAndPassword(email,password)

    //déconnexion
    signoutUser = () => this.auth.signOut();

}

export default Fairebase