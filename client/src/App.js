import Tracker from './components/Tracker';
import './App.css';
import LoginAdmin from './components/LoginAdmin';
import Admin from "./components/Admin";
import {BrowserRouter, Route, Routes, Link} from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';

function App() {

 return (
    <div className="App">
      
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Tracker/>}/>
            <Route path="/admin" element={<LoginAdmin/>}/>

              <Route element={<ProtectedRoute/>}>
                  <Route path="/admin-panel" element={<Admin/>}/>
              </Route>
            
            
          </Routes>
        </BrowserRouter>
      
    </div>
  );
}

export default App;
