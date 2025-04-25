import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  return (
    <div
      className={`transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-10"
      } bg-gray-100 flex flex-col relative items-center overflow-hidden`}
    >
      {/* Collapse Button */}
      <button
        className="absolute top-2 right-2 text-sm text-gray-600 hover:text-gray-800"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "←" : ">"}
      </button>

      <div className="flex-1 flex flex-col items-center justify-center mt-12 w-full">
        <div
          className={`transition-all duration-300 origin-left overflow-hidden ${
            sidebarOpen
              ? "scale-100 opacity-100 max-h-40"
              : "scale-0 opacity-0 max-h-0"
          }`}
        >
          {user ? (
            <div
              className="text-[1.2rem] cursor-pointer text-[#156f8d] flex flex-col items-center gap-1 group"
              onClick={() => alert("Save feature here")}
            >
              <span
                className="text-[1.5rem] block group-hover:animate-bounce"
                role="img"
                aria-label="file"
              >
                📄
              </span>
              <h3 className="uppercase tracking-wider text-xs font-bold text-[#156f8d] m-0">
                Save Document
              </h3>
            </div>
          ) : (
            <p className="text-sm font-bold leading-[1.45] text-center text-[#374151]">
              Sign-in to save your anonymized documents for future access.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
