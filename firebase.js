import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
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
