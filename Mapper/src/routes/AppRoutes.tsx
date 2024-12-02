import { Route, Routes } from "react-router-dom";
import Home from '../pages/home/components/Home'
import SignInSide from "../pages/Login/SignInSide";

const AppRoutes = () => {
  return (
    <>
    
    <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/login" element={<SignInSide/>} /> 
    </Routes>
    </>
  )
}

export default AppRoutes