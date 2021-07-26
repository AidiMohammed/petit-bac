import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Fairebase,{firebaseContexte} from './components/Firebase' 
ReactDOM.render(
    <React.StrictMode>
      <firebaseContexte.Provider value = {new Fairebase}> 
        <App />
      </firebaseContexte.Provider>
    </React.StrictMode>,
  document.getElementById('root')
);