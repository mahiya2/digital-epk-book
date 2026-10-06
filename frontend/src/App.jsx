import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DataEntry from "./pages/DataEntry";
import Summary from "./pages/Summary";
import History from "./pages/History";
import ProtectedRoute from "./ProtectedRoute";
import DashboardHome from "./pages/DashboardHome";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Register */}
        <Route path="/register" element={<Register />} />

        {/* Dashboard Layout */}
{/* Dashboard Layout */}
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />}>
          {/* Dashboard Home */}
<Route
  index
  element={<DashboardHome />}
/>

          {/* Data Entry */}
          <Route
            path="data-entry"
            element={<DataEntry />}
          />

          {/* Temporary Summary */}
         <Route
  path="summary"
  element={<Summary />}
/>

          {/* Temporary History */}
          <Route
  path="history"
  element={<History />}
/>

     </Route>
</Route>

</Routes>
    </BrowserRouter>
  );
}

export default App;