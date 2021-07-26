import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Fairebase,{firebaseContexte} from './components/Firebase' 
ReactDOM.render(
  <firebaseContexte.Provider value = {new Fairebase}> 
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </firebaseContexte.Provider>,
  document.getElementById('root')
);