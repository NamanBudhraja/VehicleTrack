import React, { useState, useMemo } from "react";
import VehicleCard from "./VehicleCard";

const VehicleList = ({
    vehicles,
    onContactOwner,
    onDeleteVehicle,
    onUpdateVehicle,
}) => {
    const [companyFilter, setCompanyFilter] = useState("");
    const [sortBy, setSortBy] = useState("distanceCovered"); // Default sorting by distanceCovered

    // Filter and sort vehicles based on user input
    const filteredAndSortedVehicles = useMemo(() => {
        return vehicles
            .filter(
                (vehicle) =>
                    vehicle.companyName &&
                    vehicle.companyName.toLowerCase().includes(companyFilter.toLowerCase())
            )
            .sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
    }, [vehicles, companyFilter, sortBy]);

    return (
        <div className="list" style={{ marginTop: "20px" }}>
            <h2 style={{ color: "#007BFF", marginBottom: "15px" }}>Vehicle List</h2>

            {/* Filter and Sort Controls */}
            <div style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
                <label style={{ marginRight: "10px" }}>
                    Filter by Company Name:
                    <input
                        type="text"
                        value={companyFilter}
                        onChange={(e) => setCompanyFilter(e.target.value)}
                        style={{ marginLeft: "5px", padding: "5px", borderRadius: "4px" }}
                    />
                </label>
                <label style={{ marginLeft: "20px" }}>
                    Sort by:
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ marginLeft: "5px", padding: "5px", borderRadius: "4px" }}
                    >
                        <option value="distanceCovered">Distance Covered</option>
                        <option value="mileage">Mileage</option>
                    </select>
                </label>
            </div>

            <div className="list-container" style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                {filteredAndSortedVehicles.length > 0 ? (
                    filteredAndSortedVehicles.map((vehicle) => (
                        <VehicleCard
                            key={vehicle._id}
                            vehicle={vehicle}
                            onContactOwner={onContactOwner}
                            onDeleteVehicle={() => onDeleteVehicle(vehicle._id, vehicle.owner.email)}
                            onUpdateVehicle={onUpdateVehicle}
                        />
                    ))
                ) : (
                    <p style={{ color: "#999" }}>No vehicles match your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default VehicleList;
