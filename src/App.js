import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';  
import Profile from './components/Profile'
import ForgetPassword from './components/ForgetPassword'

import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'

function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/forgetPassword" component={ForgetPassword} />
        </Switch>
      </Router>
  );
}

export default App;
