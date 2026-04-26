import { Routes, Route, Navigate } from "react-router-dom";


import { RegisterPage }       from "../pages/auth/RegisterPage";


export function AppRouter() {
   return( 

    <Routes>
      <Route
        path="/register"
        element={<RegisterPage />}
        />
    </Routes>
   )
}