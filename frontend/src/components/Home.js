import React, { useState, useEffect } from "react";
import VehicleList from "./VehicleList";
import AddVehicle from "./AddVehicle";
import axios from "axios";
import "../App.css";
import { useAuth } from "../AuthContext"; // Import AuthContext for user state and logout
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [vehicles, setVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const { user, logout } = useAuth(); // Access user and logout from AuthContext
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:3001/api/cars")
            .then((response) => setVehicles(response.data))
            .catch((error) => console.error(error));
    }, []);

    const handleAddVehicle = (newVehicle) => {
        setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
    };

    const handleContactOwner = (email) => {
        alert(`Contacting the owner of the vehicle at ${email}`);
    };
    const handleProfileClick = () => {
        navigate("/profile");
    };
    const handleDeleteVehicle = async (vehicleId, ownerEmail) => {
        if (ownerEmail !== user.email) {
            alert("You cannot delete a vehicle posted by someone else.");
            return;
        }

        try {
            await axios.delete(`http://localhost:3001/api/cars/${vehicleId}`);
            setVehicles((prevVehicles) =>
                prevVehicles.filter((vehicle) => vehicle._id !== vehicleId)
            );
        } catch (error) {
            console.error("Error deleting vehicle:", error);
        }
    };

    const handleUpdateVehicle = async (updatedVehicle) => {
        if (updatedVehicle.owner.email !== user.email) {
            alert("You cannot update a vehicle posted by someone else.");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:3001/api/cars/${updatedVehicle._id}`,
                updatedVehicle
            );

            setVehicles((prevVehicles) =>
                prevVehicles.map((vehicle) =>
                    vehicle._id === updatedVehicle._id ? response.data : vehicle
                )
            );
        } catch (error) {
            console.error("Error updating vehicle:", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/signin");
    };

    return (
        <div>
            {/* Header Section */}
            <div className="navbar">
                <h1 className="app-title">Vehicle Tracking System</h1>
				<div className="navbar-right">
                <button onClick={handleProfileClick} className="profile-button">
                 Profile
                </button>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
				</div>
            </div>

            {/* Main Content */}
            <div className="main-container">
                <button onClick={() => setShowForm(!showForm)} className="toggle-form-button">
                    {showForm ? "Close" : "Add New Vehicle"}
                </button>
                {showForm && <AddVehicle onAddVehicle={handleAddVehicle} />}
                <VehicleList
                    onDeleteVehicle={handleDeleteVehicle}
                    onUpdateVehicle={handleUpdateVehicle}
                    vehicles={vehicles}
                    onContactOwner={handleContactOwner}
                />
            </div>
        </div>
    );
};

export default Home;
