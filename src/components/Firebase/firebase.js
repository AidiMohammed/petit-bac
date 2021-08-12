import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyCIyq-SOZPmoaS_i6goI_91qLRinJLqTgM",
    authDomain: "magictoolreact.firebaseapp.com",
    databaseURL: "https://magictoolreact-default-rtdb.europe-west1.firebasedatabase.app",
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
        this.dataBaseReialTime = firebase.database();
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
    user = userid => this.db.collection("users").doc("allusers").collection("datausers").doc(userid);

    // creat notification
    creatNotification = typeNotification => this.db.collection("notifications").doc(typeNotification);

    //users names (collection) users doc (allusers)
    usersNames = () => this.db.collection(`users`).doc("allusers");

    sentInvitation = uid => this.dataBaseReialTime.ref(`Notifications/${uid}`);

}

export default Fairebase