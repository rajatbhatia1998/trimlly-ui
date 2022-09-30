
import React,{useEffect,useState} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  redirect,
  useNavigate
 } from "react-router-dom";
 import {useSelector,useDispatch} from 'react-redux'
 import Landing from './components/Landing'
import Dashboard from './components/Dashboard'
import {notification,message} from 'antd'
import Spinner from './components/common/Spinner'
import ShortUrlRedirect from './components/ShortUrlRedirect';
import app from './extras/firebase'
import { getAuth}from 'firebase/auth'
function App() {
  const [loading,setLoading] = useState(true)
  const [isLoggedIn,setisLoggedIn] = useState(false)

  useEffect(()=>{
  
    getAuth().onAuthStateChanged(function(user) {
      console.log('auth state changed',user)
      if (user) {
        // User is signed in.
        setisLoggedIn(true)
       window.history.pushState({},undefined,'/dashboard')
        // ...
      } else {
        window.history.pushState({},undefined,'/')
      }
    });
  },[])
 
  return (
    <div className="App">
   
       <Router>   
        <Routes>
          <Route path="/" exact element={<Landing/>}>
          
          </Route>
              
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/:slug" element={<ShortUrlRedirect />} />
        
         
          
           
        
          
        </Routes>
        </Router>
      
    </div>
  );
}

export default App;
