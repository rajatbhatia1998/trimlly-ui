
import React,{useEffect,useState} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  redirect,
  useNavigate,
  Navigate
 } from "react-router-dom";
 import {useSelector,useDispatch,Provider} from 'react-redux'
 import store from './redux/store';

import {notification,message} from 'antd'
import Spinner from './components/common/Spinner'
import ShortUrlRedirect from './components/ShortUrlRedirect';
import app from './extras/firebase'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard/Dashboard'
import DashboardDefault from './components/Dashboard/Default/DashboardDefault';
import Analytics from './components/Dashboard/Analytics';
import CreateUrl from './components/Dashboard/Default/CreateUrl';
import {getAuth,onAuthStateChanged} from 'firebase/auth'
function App() {
  const [loading,setLoading] = useState(true)
  const [isLoggedIn,setIsLoggedIn] = useState(false)
  


  var openNotificationWithIcon = (type,msg,desc) => {
    notification[type]({
      message: msg,
      description:desc
        
    });
  };

 
  
 
  return (
    <Provider store={store}>
      
    <div className="App">
   
       <Router>   
      
        <Routes>
          
          <Route path="/" exact element={<Landing/>}/>
          
          
              
          <Route path="/dashboard" element={<Dashboard/>}>
               <Route path='default' element={<DashboardDefault />} >
               <Route path='create' element={<CreateUrl />} />
               <Route path='edit' element={<Analytics />} />
                </Route>
               <Route path='analytics' element={<Analytics />} />
          </Route>
          <Route path="/:slug" element={<ShortUrlRedirect />} />
        
         
          
           
        
          
        </Routes>
        </Router>
      
    </div>
    </Provider>
  );
}

export default App;
