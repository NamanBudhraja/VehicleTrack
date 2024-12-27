import React, { useEffect, useState } from "react";
import axios from "axios";
import VehicleCard from "./VehicleCard";
import { useAuth } from "../AuthContext";

const Profile = () => {
  const [userVehicles, setUserVehicles] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserVehicles = async () => {
      if (user && user.email) {
        try {
          const response = await axios.get(
            `http://localhost:3001/pro?ownerEmail=${user.email}`
          );
          console.log("Fetched vehicles:", response.data);
          setUserVehicles(response.data);
        } catch (error) {
          console.error("Error fetching user vehicles:", error);
        }
      }
    };

    fetchUserVehicles();
  }, [user]);

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await axios.delete(`http://localhost:3001/api/cars/${vehicleId}`);
      setUserVehicles((prevVehicles) =>
        prevVehicles.filter((vehicle) => vehicle._id !== vehicleId)
      );
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const handleUpdateVehicle = async (updatedVehicle) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/cars/${updatedVehicle._id}`,
        updatedVehicle
      );
      setUserVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle._id === updatedVehicle._id ? response.data : vehicle
        )
      );
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  return (
    <div>
      <h2>Your Uploaded Cars</h2>
      <div className="vehicle-list">
        {userVehicles.length > 0 ? (
          userVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              onDeleteVehicle={handleDeleteVehicle}
              onUpdateVehicle={handleUpdateVehicle}
              onContactOwner={() => {}}
            />
          ))
        ) : (
          <p>No vehicles uploaded by you.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
