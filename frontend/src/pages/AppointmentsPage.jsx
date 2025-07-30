// src/pages/AppointmentsPage.jsx

import React from "react";

const AppointmentsPage = ({ filter }) => {
  return (
    <div>
      <h1>Appointments - {filter ? filter.toUpperCase() : "All"}</h1>
      {/* Appointments list or logic goes here */}
    </div>
  );
};

export default AppointmentsPage;
