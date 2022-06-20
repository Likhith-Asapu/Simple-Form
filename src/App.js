import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import React from "react";
import Form from "./FormFolder/form"




function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="form" element={<Form />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
