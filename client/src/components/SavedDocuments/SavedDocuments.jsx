import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { Trash2, Download, ChevronLeft, ChevronRight } from "lucide-react";

function SavedDocuments() {
  const [userDocs, setUserDocs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 5;
  const { user } = useAuth();
  const [csrfToken, setCsrfToken] = useState(null);
  const nav = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:8000/csrf", { withCredentials: true })
      .then(() => setCsrfToken(Cookies.get("csrftoken")))
      .catch((error) => console.log("Error fetching CSRF token:", error));
  }, []);

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

  const handleRemove = (docName) => {
    if (
      window.confirm(`Are you sure you want to delete '${docName}' document?`)
    ) {
      axios
        .post(
          "http://localhost:8000/delete_user_doc",
          {
            email: user.email,
            docName: docName,
          },
          {
            headers: { "X-CSRFToken": csrfToken },
            withCredentials: true,
          }
        )
        .then((result) => {
          if (result.status === 200) {
            notify("Document deleted successfully!", "success");
            setUserDocs(userDocs.filter((doc) => doc[0] !== docName));
          }
        })
        .catch((error) => {
          notify("Failed to delete document. Try again later.", "error");
        });
    }
  };

  const handleDownload = (docName) => {
    axios
      .get("http://localhost:8000/get_user_doc", {
        params: { email: user.email, docName },
      })
      .then((result) => {
        const text = result.data.text;
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `${docName}-Anonify.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        notify("Download Successful!", "success");
      })
      .catch((error) => {
        notify("Failed to download document.", "error");
        console.error("Download error:", error);
      });
  };

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

      <div className="flex flex-col min-h-[50vh]">
        {currentDocs.length === 0 ? (
          <div className="py-12 text-center ">
            <h2 className="text-gray-600 font-semibold text-2xl mb-4">
              No documents to display
            </h2>
            <p className="text-gray-400">
              Start anonymizing, save your documents, and you'll see them here!
            </p>
          </div>
        ) : (
          <>
            <div className="flex-grow">
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
                  <div
                    onClick={() =>
                      nav(`/edit/${encodeURIComponent(doc[0])}`, {
                        state: { docName: doc[0], content: doc[1] },
                      })
                    }
                    className="w-1/3 text-teal-800 truncate text-[#15143966] pr-2 font-semibold cursor-pointer"
                  >
                    {doc[0]}
                  </div>
                  <div className="w-1/3 text-center text-[#235F6B]">
                    {doc[1]}
                  </div>
                  <div className="w-1/3 flex justify-end">
                    <button className="text-orange-500 hover:text-orange-600">
                      <div className="flex gap-4 items-center ">
                        <Download
                          className="transition-transform duration-200 hover:scale-105"
                          onClick={() => handleDownload(doc[0])}
                        />
                        <Trash2
                          className="text-red-500 transition-transform duration-200 hover:scale-105"
                          onClick={() => handleRemove(doc[0])}
                        />
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center px-4">
                <button
                  onClick={goToPrevPage}
                  className={`px-4 py-2 font-semibold border border-[#f96e2a] text-[#f96e2a] bg-transparent hover:bg-[#f96e2a] hover:text-white rounded transition-colors duration-300 ${
                    currentPage === 1 ? "invisible" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </span>
                </button>

                <div className="flex space-x-3 items-center">
                  {Array.from({ length: Math.max(1, totalPages) }).map(
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`w-3 h-3 rounded-full border ${
                          currentPage - 1 === index
                            ? "bg-[#1d6b73] border-[#1d6b73]"
                            : "border-[#b7cfd5]"
                        } transition duration-300`}
                      />
                    )
                  )}
                </div>

                <button
                  onClick={goToNextPage}
                  className={`px-4 py-2 font-semibold border border-[#f96e2a] text-[#f96e2a] bg-transparent hover:bg-[#f96e2a] hover:text-white rounded transition-colors duration-300 ${
                    currentPage === totalPages || totalPages === 0
                      ? "invisible"
                      : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    Next <ChevronRight className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SavedDocuments;
