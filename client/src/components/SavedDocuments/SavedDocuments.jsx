import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { Pencil, Download } from "lucide-react";

function SavedDocuments() {
  const [userDocs, setUserDocs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 5;
  const { user } = useAuth();

  const notify = (
    message = "Oh Snap! Something went wrong.",
    type = "error"
  ) => {
    toast[type](message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  useEffect(() => {
    if (!user?.email) return;
    axios
      .get("http://localhost:8000/get_user_doc_names", {
        params: { email: user.email },
      })
      .then((result) => {
        setUserDocs(result.data.docNames);
      })
      .catch((error) => {
        notify("Failed to fetch documents.");
        console.error("Fetch error:", error);
      });
  }, [user?.email]);

  const indexOfLastDoc = currentPage * docsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - docsPerPage;
  const currentDocs = userDocs.slice(indexOfFirstDoc, indexOfLastDoc);
  const totalPages = Math.ceil(userDocs.length / docsPerPage);

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="p-4 w-full max-w-5xl mt-12">
      <h2 className="text-3xl font-semibold mb-12 text-center text-[#0e5266] mb-10">
        Saved Documents
      </h2>

      <div className="flex pb-4 text-[#15143966] font-[600] ">
        <div className="w-1/3 pl-4">FILE NAME</div>
        <div className="w-1/3 text-center">LAST CHANGE</div>
        <div className="w-1/3 text-right pr-4">EDIT</div>
      </div>
      {currentDocs.map((doc, index) => (
        <div
          key={index}
          className={
            index % 2 === 0
              ? "flex items-center p-4 rounded-lg hover:shadow-md md:py-4 lg:py-6 transition bg-[#92b8c0] hover:bg-[#92b8c0]/80"
              : "flex items-center p-4 rounded-lg hover:shadow-lg md:py-4 lg:py-6 transition hover:bg-stone-200"
          }
        >
          <div className="w-1/3 text-teal-800 font-medium truncate text-[#15143966] pr-2 font-semibold">
            {doc[0]}
          </div>
          <div className="w-1/3 text-center text-[#235F6B]">{doc[1]}</div>
          <div className="w-1/3 flex justify-end">
            <button className="text-orange-500 hover:text-orange-600">
              <div className="flex gap-2 items-center ">
                <Pencil
                  className="transition-transform duration-200 hover:scale-105"
                  onClick={() => alert("edit to be implemented")}
                />
                <Download
                  className="transition-transform duration-200 hover:scale-105"
                  onClick={() => alert("download to be implemented")}
                />
              </div>
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center mt-20 ">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
        >
          &#11013; Previous
        </button>
        <div className="flex justify-center space-x-3 my-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full border 
            ${
              currentPage - 1 === index
                ? "bg-[#1d6b73] border-[#1d6b73]"
                : "border-[#b7cfd5]"
            }
            transition duration-500`}
            />
          ))}
        </div>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
        >
          Next &#10140;
        </button>
      </div>
    </div>
  );
}

export default SavedDocuments;
