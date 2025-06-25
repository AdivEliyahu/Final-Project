import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import SavingModal from "../Anonymizer/SavingModal/SavingModal";

function EditDocument() {
  const location = useLocation();
  const { docName } = location.state || {};
  const [text, setText] = useState("");
  const [tokens, setTokens] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [modal, setModal] = useState(false);
  const [userDocs, setUserDocs] = useState([]);
  const [csrfToken, setCsrfToken] = useState(null);
  const [helpMessage, setHelpMessage] = useState(false);
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

  const fetchUserDocs = useCallback(() => {
    if (!user?.email) return;
    axios
      .get("http://localhost:8000/get_user_doc_names", {
        params: { email: user.email },
      })
      .then((result) => {
        setUserDocs(result.data.docNames);
      })
      .catch((error) => {
        console.error("Failed to fetch user:", error);
      });
  }, [user?.email]);

  useEffect(() => {
    if (user) {
      fetchUserDocs();
    }
  }, [user, fetchUserDocs]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/csrf", { withCredentials: true })
      .then(() => setCsrfToken(Cookies.get("csrftoken")))
      .catch((error) => console.error("Error fetching CSRF token:", error));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/get_user_doc", {
        params: { email: user.email, docName },
      })
      .then((result) => {
        setText(result.data.text);
      })
      .catch(() => {
        notify("Something went wrong! Please try again later.");
      });
  }, [docName, user]);

  useEffect(() => {
    const splitRegex = /(\s+)/;
    const newTokens = text.split(splitRegex).map((t) => ({
      value: t,
      isWord: !/^\s+$/.test(t), //non space
    }));

    // Process tokens to separate punctuation
    const processedTokens = [];
    newTokens.forEach((token) => {
      if (token.isWord && /[,.]$/.test(token.value)) {
        // Add word without punctuation
        processedTokens.push({
          value: token.value.slice(0, -1),
          isWord: true,
        });
        // Add punctuation as separate token
        processedTokens.push({
          value: token.value.slice(-1),
          isWord: false,
        });
      } else {
        processedTokens.push(token);
      }
    });

    setTokens(processedTokens);
    setSelectedIdx(null);
  }, [text]);

  const replacements = useMemo(
    () => [
      ["<PERSON>", "bg-amber-100   text-amber-800   border-amber-400"],
      ["<ORG>", "bg-emerald-100 text-emerald-800 border-emerald-400"],
      ["<LOCATION>", "bg-sky-100     text-sky-800     border-sky-400"],
      ["<DATETIME>", "bg-violet-100  text-violet-800  border-violet-400"],
      ["<PHONE>", "bg-rose-100    text-rose-800    border-rose-400"],
      ["<EMAIL>", "bg-cyan-100    text-cyan-800    border-cyan-400"],
      ["<CODE>", "bg-lime-100    text-lime-800    border-lime-400"],
      ["<MISC>", "bg-indigo-100  text-indigo-800  border-indigo-400"],
    ],
    []
  );

  const handleWordClick = (idx) => {
    if (!tokens[idx].isWord) return;
    setSelectedIdx(idx);
  };

  const handleReplace = (rep) => {
    if (selectedIdx === null) {
      notify("Please select a word first.", "info");
      return;
    }
    const newTokens = [...tokens];
    newTokens[selectedIdx] = { value: rep, isWord: true };
    setTokens(newTokens);
    setText(newTokens.map((t) => t.value).join(""));
    setSelectedIdx(null);
  };

  return (
    <div className="mx-auto w-full max-w-screen-lg px-4 py-6 lg:py-8 ">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 break-words">
        Document: {docName}
      </h1>

      <div className="flex flex-col gap-6 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:gap-12">
        <div className="bg-white rounded-lg shadow p-4 overflow-auto max-h-[55vh] sm:max-h-[65vh] relative">
          <p className="whitespace-pre-wrap leading-relaxed">
            {tokens.map((tok, idx) =>
              tok.isWord ? (
                <span
                  key={idx}
                  onClick={() => handleWordClick(idx)}
                  className={`cursor-pointer px-[0.1rem] py-[0.2rem] transition-colors rounded-xl ${
                    idx === selectedIdx ? "bg-[#FB8500]" : ""
                  }`}
                >
                  {tok.value}
                </span>
              ) : (
                <span key={idx}>{tok.value}</span>
              )
            )}
          </p>
          <div
            className="sticky right-0 bottom-0 px-1 py-1 place-items-end"
            onMouseEnter={() => setHelpMessage(true)}
            onMouseLeave={() => setHelpMessage(false)}
          >
            {/* lucide icons question mark has an issue therefore quesion mark svg*/}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-circle-question-mark-icon lucide-circle-question-mark"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            {helpMessage && (
              <div className="bg-[#f5a73b] text-white absolute bottom-6 right-6 z-20 w-[220px] md:w-[350px] px-3 py-2 rounded-lg animate-fadeIn">
                Click a word to mask it, then choose the best replacement tag
                from the list.
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:flex-col md:gap-2 md:w-48 py-3 px-4 items-left overflow-x-auto md:overflow-visible">
          <h2 className="w-full text-lg font-semibold mb-1 md:mb-2">
            Replacements
          </h2>
          {replacements.map(([tag, color]) => (
            <button
              key={tag}
              onClick={() => handleReplace(tag)}
              className={`border ${color} whitespace-nowrap text-xs cursor-pointer font-semibold px-3 py-1 rounded-full w-fit`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div className="flex mt-8">
        <button
          onClick={() => setModal((prev) => !prev)}
          className="bg-[#FB8500] hover:bg-[#ffb347] text-white font-semibold py-2 px-8 rounded-full shadow transition-colors duration-200 "
        >
          Save
        </button>
      </div>
      {modal && (
        <SavingModal
          setModal={setModal}
          anonymizedText={text}
          notify={notify}
          csrfToken={csrfToken}
          userDocs={userDocs}
          fetchUserDocs={fetchUserDocs}
        />
      )}
    </div>
  );
}

export default EditDocument;
