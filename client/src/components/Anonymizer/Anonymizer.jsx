import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import SavingModal from "./SavingModal/SavingModal";

function Anonymizer() {
  const { user } = useAuth();
  const [originalText, setOriginalText] = useState("");
  const [anonymizedText, setAnonymizedText] = useState("");
  const [csrfToken, setCsrfToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const notify = (
    message = "Oh Sanp! Something went wrong :(",
    type = "error"
  ) => {
    toast[type](message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/csrf", { withCredentials: true })
      .then(() => setCsrfToken(Cookies.get("csrftoken")))
      .catch((error) => console.error("Error fetching CSRF token:", error));
  }, []);

  const handleAnonymize = async () => {
    if (!originalText.trim()) {
      notify("Please enter text first", "warning");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/anonymize/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ text: originalText }),
      });

      if (!response.ok) {
        throw new Error("Failed to extract entities");
      }

      const data = await response.json();
      setAnonymizedText(data.anonymized_text);
    } catch (error) {
      notify("An error occurred while anonymizing the text.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSavingDocument = () => {
    setModal(!modal);
  };

  return (
    <div className="flex w-full min-h-full">
      {/* Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 max-w-screen-xl mx-auto py-10 px-6">
        <section className="flex flex-col flex-1 gap-6 w-full">
          <div className="flex flex-1 flex-col w-full">
            {/* Textareas + Save */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_100px] gap-6 w-full">
              {/* Original Text */}
              <div className="relative flex flex-col">
                <p className="text-sm font-semibold text-[#0e5266] mb-2">
                  Original Text
                </p>
                <textarea
                  className={`flex-1 min-h-[500px] bg-[#c8dde1] border-none rounded-md p-4 font-mono text-base leading-[1.5] text-[#374151] resize-none shadow-inner placeholder:text-[#9ca3af] transition-all duration-300 ${
                    loading ? "opacity-50" : ""
                  }`}
                  placeholder="Paste or type the text you’d like to anonymize…"
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  disabled={loading}
                />
                {/* Shimmer Overlay */}
                {loading && (
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer pointer-events-none"></div>
                )}
              </div>

              {/* Anonymized Text */}
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-[#0e5266] mb-2">
                  Anonymized Text
                </p>
                <textarea
                  className="flex-1 min-h-[500px] bg-[#c8dde1] border-none rounded-md p-4 font-mono text-base leading-[1.5] text-[#374151] resize-none shadow-inner placeholder:text-[#9ca3af]"
                  placeholder="Anonymized output will appear here…"
                  value={anonymizedText}
                  readOnly
                  disabled={loading}
                />
              </div>

              {/* Save Button */}
              <div className="hidden lg:flex w-[100px] flex-col justify-center items-center">
                {user ? (
                  <div
                    className="cursor-pointer text-[#156f8d] hover:text-[#0e5266] transition flex flex-col items-center gap-2 group"
                    onClick={() => handleSavingDocument()}
                  >
                    <div className="text-3xl group-hover:animate-bounce">
                      📄
                    </div>
                    <div className="text-xs uppercase font-bold tracking-wide text-center">
                      Save Document
                    </div>
                  </div>
                ) : (
                  <div className="invisible text-3xl">📄</div>
                )}
              </div>

              {/* Anonymize Button */}
              <div className="lg:col-span-2 flex justify-center mt-4">
                <button
                  className="bg-[#ff8450] hover:bg-[#ffa764] text-white font-semibold rounded-full px-10 py-3 transition flex items-center gap-2"
                  onClick={handleAnonymize}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    "Anonymize"
                  )}
                </button>
              </div>

              {/* Save Button (only visible on small screens) */}
              <div className="group flex flex-col items-center mt-4 lg:hidden">
                <button
                  className="text-[#156f8d] hover:text-[#0e5266] flex flex-col items-center gap-2"
                  onClick={() => alert("Save feature here")}
                >
                  <div className="text-2xl group-hover:animate-bounce">📄</div>
                  <div className="text-xs uppercase font-bold tracking-wide text-center">
                    Save Document
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      {modal && (
        <SavingModal
          setModal={setModal}
          anonymizedText={anonymizedText}
          notify={notify}
          csrfToken={csrfToken}
        />
      )}
    </div>
  );
}

export default Anonymizer;
