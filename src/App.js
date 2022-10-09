
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
import AnalyticsDefault from './components/Dashboard/Analytics/AnalyticsDefault';
import CreateUrl from './components/Dashboard/Default/CreateUrl';
import {getAuth,onAuthStateChanged} from 'firebase/auth'
import SecureDefault from './components/Dashboard/Secure/SecureDefault';
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
                    <Route path='edit' element={<CreateUrl />} />
                </Route>
                 <Route path='secure' element={<SecureDefault />} />
                  
                
               <Route path='analytics' element={<AnalyticsDefault />} />

          </Route>
          <Route path="/:slug" element={<ShortUrlRedirect />} />
        
         
          
           
        
          
        </Routes>
        </Router>
      
    </div>
    </Provider>
  );
}

export default App;
