import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';  
import Profile from './components/Profile'

import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'

function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/profile" component={Profile} />
        </Switch>
      </Router>
  );
}

export default App;
