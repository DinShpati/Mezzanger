import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

/*const firebaseConfig = {
  apiKey: "AIzaSyDDgQgMDnX2_-hQ6NSTN6aeJlnTaXhhzfI",
  authDomain: "messaging-app-1b108.firebaseapp.com",
  projectId: "messaging-app-1b108",
  storageBucket: "messaging-app-1b108.appspot.com",
  messagingSenderId: "2684077809",
  appId: "1:2684077809:web:ca8f075ab30636c6148b50"
};*/
const firebaseConfig = {
  apiKey: "AIzaSyDnDc2Cz7lsRqyM7lY_HCCiqLpkYSkTerA",
  authDomain: "signal-clone-e7d54.firebaseapp.com",
  projectId: "signal-clone-e7d54",
  storageBucket: "signal-clone-e7d54.appspot.com",
  messagingSenderId: "590145994766",
  appId: "1:590145994766:web:333af1aeee442362663c5f"
};

let app;

if(firebase.apps.length === 0){
  app = firebase.initializeApp(firebaseConfig);
  //app.analytics();
}else{
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();


export {db, auth};