import { Route, Routes } from "react-router-dom";
import Home from '../pages/home/components/Home'
import SignInSide from "../pages/Login/SignInSide";
import PrivateRoute from "../auth/PrivateRoutes";

const AppRoutes = () => {
  return ( 
    <Routes>
      <Route path="/" element={<SignInSide />} />
      <Route path="/login" element={<SignInSide />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default AppRoutes