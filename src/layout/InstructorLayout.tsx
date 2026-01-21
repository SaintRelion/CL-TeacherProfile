import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const InstructorLayout = () => {
  return (
    <div className="min-h-lvh">
      <Navbar />
      <Outlet />
    </div>
  );
};
export default InstructorLayout;
