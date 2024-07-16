import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCw6k7EMZmKZ9GRH2RjY1pPkf2NXFFKTzk",
  authDomain: "link-hub-cadca.firebaseapp.com",
  databaseURL: "https://link-hub-cadca-default-rtdb.firebaseio.com",
  projectId: "link-hub-cadca",
  storageBucket: "link-hub-cadca.appspot.com",
  messagingSenderId: "274425512149",
  appId: "1:274425512149:web:39b13029c6500951ad625c"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
