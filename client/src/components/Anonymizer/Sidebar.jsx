import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarRightExpand,
} from "react-icons/tb";

const Sidebar = ({ userDocs }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showContent, setShowContent] = useState(true);
  const { user } = useAuth();
  const nav = useNavigate();

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
      } bg-gray-100 flex flex-col relative transition-all duration-300 ease-in-out h-full`}
    >
      {/* Toggle Sidebar Button */}
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 hover:bg-gray-300 p-1 rounded-sm"
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
        <div className="mt-4 px-4 flex flex-col h-full">
          {user ? (
            <>
              {/* Section Title */}
              <h3 className="text-sm text-gray-500 font-semibold mb-3 px-1 uppercase tracking-wide">
                🗃️ Your Documents
              </h3>

              {/* Documents Card */}
              <div className="flex-1 p-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col justify-start overflow-y-auto mb-4">
                <ul className="space-y-2">
                  {userDocs.length === 0 ? (
                    <li className="text-gray-400 italic">
                      No documents saved.
                    </li>
                  ) : (
                    userDocs.map((doc, index) => (
                      <li
                        key={index}
                        onClick={() =>
                          nav(`/edit/${encodeURIComponent(doc[0])}`, {
                            state: { docName: doc[0], content: doc[1] },
                          })
                        }
                        className="flex items-center gap-3 cursor-pointer rounded-lg p-3 hover:bg-gray-100 transition border border-gray-100"
                      >
                        {/* Doc Icon */}
                        <div className="flex-shrink-0 h-full flex items-center">
                          <div className="w-10 h-10 bg-[#006d77]/20 text-blue-600 flex items-center justify-center rounded-xl shadow-sm">
                            <span className="text-xl">📄</span>
                          </div>
                        </div>

                        {/* Doc Info */}
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-semibold text-gray-800 truncate">
                            {doc[0]}
                          </span>
                          <span className="text-sm text-gray-500 truncate">
                            {doc[1]}
                          </span>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </>
          ) : (
            <div className=" flex flex-col">
              <h3 className="text-sm text-gray-500 font-semibold mb-3 px-1 uppercase tracking-wide">
                🗃️ Your Documents
              </h3>
              <div className="flex-1 p-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col justify-start overflow-y-auto mb-4">
                <p className="text-sm text-gray-600">
                  Sign in to securely save your anonymized documents and access
                  them anytime.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
