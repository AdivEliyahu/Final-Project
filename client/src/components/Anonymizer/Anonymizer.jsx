import React from "react";
import "./Anonymizer.css";
import { useAuth } from "../../context/AuthContext";

function Anonymizer() {
  const { user } = useAuth();

  return (
    <main className="anonymizer-page">
      <section className="anonymizer-container">
        <h1 className="anonymizer-title">Text Anonymization</h1>

        <textarea
          className="anonymizer-textbox"
          placeholder="Paste or type the text you’d like to anonymize…"
          rows={8}
        />

        <button
          className="anonymizer-btn"
          onClick={() => {
            alert("Connect model here");
          }}
        >
          Anonymize
        </button>
      </section>

      <aside className="save-card">
        {user ? (
          <>
            <div
              className="save-icon"
              onClick={() => {
                alert("Save feature here");
              }}
            >
              <span className="saving-emoji" role="img" aria-label="file">
                📄
              </span>
              <h3 className="save-heading">Save Document</h3>{" "}
            </div>
          </>
        ) : (
          <p className="save-caption">
            Sign-in to save your anonymized documents for future access.
          </p>
        )}
      </aside>
    </main>
  );
}

export default Anonymizer;
