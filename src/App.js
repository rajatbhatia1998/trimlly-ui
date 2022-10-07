
import React,{useEffect,useState} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  redirect,
  useNavigate
 } from "react-router-dom";
 import {useSelector,useDispatch,Provider} from 'react-redux'
 import store from './redux/store';
 import Landing from './components/Landing'
import Dashboard from './components/Dashboard'
import {notification,message} from 'antd'
import Spinner from './components/common/Spinner'
import ShortUrlRedirect from './components/ShortUrlRedirect';
import app from './extras/firebase'
import { getAuth}from 'firebase/auth'

function App() {
  const [loading,setLoading] = useState(true)


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
          <Route path="/" exact element={<Landing/>}>
          
          </Route>
              
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/:slug" element={<ShortUrlRedirect />} />
        
         
          
           
        
          
        </Routes>
        </Router>
      
    </div>
    </Provider>
  );
}

export default App;
