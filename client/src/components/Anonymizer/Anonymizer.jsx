import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";

function Anonymizer() {
  const { user } = useAuth();

  return (
    <div className="flex w-full min-h-full">
      <Sidebar/>

      {/* Main Content */}
      <div className="flex flex-col flex-1 max-w-screen-xl mx-auto py-12 px-6">
        <section className="flex flex-col flex-1 gap-6 w-full">
          <div className="flex flex-1 flex-col w-full">
            {/* Textareas */}
            <div className="flex flex-col lg:flex-row gap-6 w-full">
              {/* Original Text */}
              <div className="flex-1 flex flex-col">
                <p className="text-sm font-semibold text-[#0e5266] mb-2">
                  Original Text
                </p>
                <textarea
                  className="flex-1 min-h-[250px] bg-[#c8dde1] border-none rounded-md p-4 font-mono text-base leading-[1.5] text-[#374151] resize-none shadow-inner placeholder:text-[#9ca3af]"
                  placeholder="Paste or type the text you’d like to anonymize…"
                />
              </div>

              {/* Anonymized Text */}
              <div className="flex-1 flex flex-col">
                <p className="text-sm font-semibold text-[#0e5266] mb-2">
                  Anonymized Text
                </p>
                <textarea
                  className="flex-1 min-h-[250px] bg-[#c8dde1] border-none rounded-md p-4 font-mono text-base leading-[1.5] text-[#374151] resize-none shadow-inner placeholder:text-[#9ca3af]"
                  placeholder="Anonymized output will appear here…"
                  readOnly
                />
              </div>
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
