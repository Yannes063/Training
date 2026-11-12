
import ShowCustomer from './ShowCustomer'
import ShowTraining from './ShowTraining'
import {useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CssBaseline from "@mui/material/CssBaseline";


export type cusinfo = {
  firstname: string;
  lastname: string;
  streetaddress: string;
  postcode: string;
  city: string;
  email:string;
  phone: string;

}



function App() {

  
const [customerInfos, setCustomerInfos] = useState<cusinfo[]>([]);

  return (
    
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<ShowCustomer />} />
        <Route path="/trainings" element={<ShowTraining />} />
      </Routes>
    </BrowserRouter>
    
      
    
  )
}

export default App
