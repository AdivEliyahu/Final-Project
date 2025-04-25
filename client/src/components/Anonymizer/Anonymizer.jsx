import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";

function Anonymizer() {
  const { user } = useAuth();

  return (
    <div className="flex w-full min-h-full">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 max-w-screen-xl mx-auto py-10 px-6">
        <section className="flex flex-col flex-1 gap-6 w-full">
          <div className="flex flex-1 flex-col w-full">
            {/* Textareas */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-6 w-full">
              {/* Original Text */}
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-[#0e5266] mb-2">
                  Original Text
                </p>
                <textarea
                  className="flex-1 min-h-[500px] bg-[#c8dde1] border-none rounded-md p-4 font-mono text-base leading-[1.5] text-[#374151] resize-none shadow-inner placeholder:text-[#9ca3af]"
                  placeholder="Paste or type the text you’d like to anonymize…"
                />
              </div>

              {/* Anonymized Text */}
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-[#0e5266] mb-2">
                  Anonymized Text
                </p>
                <textarea
                  className="flex-1 min-h-[500px] bg-[#c8dde1] border-none rounded-md p-4 font-mono text-base leading-[1.5] text-[#374151] resize-none shadow-inner placeholder:text-[#9ca3af]"
                  placeholder="Anonymized output will appear here…"
                />
              </div>

              {/* Save Button */}
              {user ? (
              <div className="flex flex-col justify-center items-center">
                <div
                  className="cursor-pointer text-[#156f8d] flex flex-col items-center gap-1 group"
                  onClick={() => alert("Save feature here")}
                >
                  <span
                    className="text-[1.5rem] block group-hover:animate-bounce"
                    role="img"
                    aria-label="file"
                  >
                    📄
                  </span>
                  <h3 className="uppercase tracking-wider text-xs font-bold text-[#156f8d]">
                    Save Document
                  </h3>
                </div>
              </div>
              ): null}
            </div>
            {/* BUTTON */}
            <div className="flex justify-center mt-8">
              <button
                className="bg-[#ff8450] hover:bg-[#ffa764] text-white font-semibold rounded-full px-10 py-3 transition"
                onClick={() => alert("Connect model here")}
              >
                Anonymize
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Anonymizer;
