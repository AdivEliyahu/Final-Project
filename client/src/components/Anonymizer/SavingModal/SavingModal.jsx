import React from "react";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function SavingModal({
  setModal,
  anonymizedText,
  notify,
  csrfToken,
  userDocs,
  fetchUserDocs,
}) {
  const { user } = useAuth();
  const [docName, setDocName] = useState("");
  const [userDocNames, setUserDocNames] = useState([]);
  const { docName: urlDocName } = useParams();
  useEffect(() => {
    setUserDocNames(userDocs.map((item) => item[0]));
  }, [userDocs]);

  useEffect(() => {
    if (urlDocName) {
      const decoded = decodeURIComponent(urlDocName);
      console.log("Doc name from URL →", decoded);
      setDocName(decoded);
    }
  }, [urlDocName]);

  const handleSave = () => {
    if (docName.length === 0) {
      notify("Please enter a document name", "warning");
    } else if (
      !userDocNames.includes(docName) ||
      window.confirm(
        "Document name already exists. You'll overwrite it are you sure?"
      )
    ) {
      const currentDate = new Date()
        .toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .toString();

      axios
        .post(
          "http://localhost:8000/save_document/",
          {
            text: anonymizedText,
            email: user.email,
            docName: docName,
            date: currentDate,
          },
          {
            headers: { "X-CSRFToken": csrfToken },
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            notify("Document saved successfully!", "success");
            fetchUserDocs(user.email);
            setModal(false);
          }
        })
        .catch((error) => {
          if (error.response) {
            notify(
              "Oh Snap, something broken! please try again later.",
              "error"
            );
          }
        });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 animate-fadeIn">
        <h1 className="text-xl font-semibold mb-4 text-[#0e5266]">
          Save Document
        </h1>
        <p className={docName.length === 40 ? "text-red-600 mb-2" : "hidden"}>
          File name must be under 40 characters.
        </p>

        <input
          type="text"
          placeholder="Enter file name"
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          maxLength={40}
        />

        <div className="flex justify-end gap-3">
          <button
            className="bg-[#b5e8ed] font- text-[#006d77] hover:bg-[#39b1bc] hover:text-white font-semibold rounded-full px-5 py-2 transition flex items-center"
            onClick={() => setModal(false)}
          >
            Cancel
          </button>

          <button
            className="bg-[#ff8450] hover:bg-[#ffa764] text-white font-semibold rounded-full px-5 py-2 transition flex items-center"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SavingModal;
