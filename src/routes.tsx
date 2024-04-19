import { Navigate, Route, Routes as Router, createBrowserRouter, useNavigate } from "react-router-dom";
import Home from "./pages/home/Home";
import RegisterUser from "./pages/register-user/RegisterUser";
import Dashboard from "./pages/dashboard/Dashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

export const ProtectedRoute = ({ children }: any) => {
    const { user }: any = useAuth();
    
    if (!user) {
        return <Navigate to="/" />;
    }
    return children;
};

export const Routes = () => {
    return (
        <AuthProvider>
            <Router>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<RegisterUser />} />
                <Route path="/dashboard" element={<ProtectedRoute> <Dashboard/> </ProtectedRoute> } />
                <Route path="*" element={<Home />} />
            </Router>
        </AuthProvider>
    )
}