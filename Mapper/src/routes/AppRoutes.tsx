import { Route, Routes, Navigate } from "react-router-dom";
import Home from '../pages/home/components/Home';
import SignInSide from "../pages/Login/SignInSide";
import { useAuth } from "../auth/AuthProvider";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

    if (isAuthenticated === undefined) {
    return null; 
  }

  return (
    <Routes>
      <Route path="/" element={<SignInSide />} />
      <Route 
        path="/home" 
        element={isAuthenticated ? <Home /> : <Navigate to="/" />} 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
