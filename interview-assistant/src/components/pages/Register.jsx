import React from 'react';
import Navbar from "../layout/Navbar";
import RegisterComponent from "../auth/Register";

const Register = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <RegisterComponent />
      </div>
    </div>
  );
};

export default Register;