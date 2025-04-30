import React from "react";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import { useState } from "react";

function SavingModal({ setModal, anonymizedText, notify, csrfToken }) {
  const { user } = useAuth();
  const [docName, setDocName] = useState("");

  const handleSave = () => {
    if (!user) {
      notify("Please log in to save your document", "warning");
      return;
    } else if (anonymizedText.length === 0) {
      notify("Please anonymize the text before saving", "warning");
    } else if (docName.length === 0) {
      notify("Please enter a document name", "warning");
    } else {
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
          }, // don't forget to implement logic to doc name later
          {
            headers: { "X-CSRFToken": csrfToken },
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            notify("Document saved successfully!", "success");
            setModal(false);
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            notify("Document already exists.", "error");
          }
          // TODO: handle other errors and overwrite logic
        });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 animate-fadeIn">
        <h1 className="text-xl font-semibold mb-4 text-gray-800">
          Save Document
        </h1>

        <input
          type="text"
          placeholder="Enter file name"
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <div className="flex justify-end gap-3">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-full transition"
            onClick={() => setModal(false)}
          >
            Cancel
          </button>

          <button
            className="bg-[#f96e2a] hover:bg-[#78b3ce] text-white font-semibold px-6 py-2 rounded-full transition"
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
