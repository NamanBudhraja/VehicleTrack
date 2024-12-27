import React from "react";
import { BrowserRouter as Router, Routes, Route ,Navigate} from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp"
import Home from "./components/Home";
//import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./AuthContext";
import Profile from "./components/Profile";
const App = () => {
  const{user}=useAuth();
    return (
        <Router>
            <Routes>
                {/* Public route for SignIn */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/profile" element={<Profile/>} />
                {/* Protected route for Home */}
                <Route
                    path="/"
                    element={user ? <Home /> : <SignIn/>}
                />
            </Routes>
        </Router>
    );
};

export default App;
