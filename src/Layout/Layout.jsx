import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";


const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col ml-72">
        <Navbar />
        <main className="flex-1 bg-blue-50-50 p-8 mt-20"><Outlet />{children}</main>
      </div>
    </div>
  );
};

export default Layout;
