import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarRightExpand,
} from "react-icons/tb";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showContent, setShowContent] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (sidebarOpen) {
      const timer = setTimeout(() => setShowContent(true), 200);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [sidebarOpen]);

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-10"
      } bg-gray-100 flex flex-col relative transition-all duration-300 ease-in-out`}
    >
      {/* Collapse Button */}
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 hover:bg-gray-300 hover:rounded-sm"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <TbLayoutSidebarRightExpand size={25} />
        ) : (
          <TbLayoutSidebarLeftExpand size={25} />
        )}
      </button>

      {/* Sidebar Content */}
      {showContent && (
        <div className="mt-12 px-4">
          {user ? (
            <div>Show docs here...</div>
          ) : (
            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="text-xs uppercase text-gray-400 tracking-wide mb-1">
                Saving Feature 📄
              </div>
              <div className="text-sm text-gray-500 font-semibold ">
                Sign in to securely save your anonymized documents and access
                them anytime.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
