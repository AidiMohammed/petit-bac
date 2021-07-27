import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCIyq-SOZPmoaS_i6goI_91qLRinJLqTgM",
    authDomain: "magictoolreact.firebaseapp.com",
    projectId: "magictoolreact",
    storageBucket: "magictoolreact.appspot.com",
    messagingSenderId: "252981923118",
    appId: "1:252981923118:web:3d68021f8e824ee5c0febf"
  };

class Fairebase
{
    constructor()
    {
        firebase.initializeApp(firebaseConfig)
        this.auth = firebase.auth();
        this.db = firebase.firestore();
    }

    //inscription
    signupUser = (email,password) => this.auth.createUserWithEmailAndPassword(email,password)
    
    //Connexion
    loginUser = (email,password) => this.auth.signInWithEmailAndPassword(email,password)

    //déconnexion
    signoutUser = () => this.auth.signOut();

    //Récupération de mot de pass
    passwordReset = email => this.auth.sendPasswordResetEmail(email);

    //user (doc)
    user = userid => this.db.doc(`users/${userid}`);

    //users (collection)
    users = () => this.db.collection(`users`);

}

export default Fairebase