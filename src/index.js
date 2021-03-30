import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css'
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
const Root=()=>(
<Router>
  <Switch>
    <Route exact path="/" component={App}/>
    <Route path="/login" component={Login}/>
    <Route path="/register" component={Register}/>
  </Switch>
</Router>
)
ReactDOM.render(
  
    <Root />
 ,
  document.getElementById('root')
);


reportWebVitals();
export default Root;
