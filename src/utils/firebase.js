import firebase from 'firebase/app';
import 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCA4O_4tL5cYKcJ0TiAGI2jQn-8xK5153s',
  authDomain: 'kloutkast-63bdc.firebaseapp.com',
  databaseURL: 'https://kloutkast-63bdc.firebaseio.com',
  projectId: 'kloutkast-63bdc',
  storageBucket: 'kloutkast-63bdc.appspot.com',
  messagingSenderId: '836615527905',
  appId: '1:836615527905:web:fd8acfc4789e0fdbdd86a0',
  measurementId: 'G-ST4DFKQG9Q',
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage();

export { storage, firebase as default };
