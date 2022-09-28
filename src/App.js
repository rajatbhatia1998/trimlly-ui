
import React,{useEffect,useState} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect
 } from "react-router-dom";
 import {useSelector,useDispatch} from 'react-redux'
 import Landing from './components/Landing'
import Dashboard from './components/Dashboard'
import {notification,message} from 'antd'
import Spinner from './components/common/Spinner'
import ShortUrlRedirect from './components/ShortUrlRedirect';
function App() {
  const [loading,setLoading] = useState(true)
 
 
  return (
    <div className="App">
       <Router>   
        <Routes>
          <Route path="/" exact element={<Landing/>}>
          
          </Route>
              
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/:shortUrl" element={<ShortUrlRedirect />} />
        
         
          
           
        
          
        </Routes>
        </Router>
      
    </div>
  );
}

export default App;
