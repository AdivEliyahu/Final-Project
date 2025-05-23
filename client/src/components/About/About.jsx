import React, { useState } from "react";
import {
  TestTubeDiagonal,
  Earth,
  ChartCandlestick,
  Calculator,
  BrainCircuit,
  Microscope,
  Database,
  RemoveFormatting,
} from "lucide-react";

const About = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [modalImage, setModalImage] = useState(null);

  const steps = [
    {
      title: "Research and Background",
      icon: <RemoveFormatting size={35} />,
      category: "research",
      description:
        "We began by studying privacy approaches and existing anonymization tools like Microsoft Presidio, Eden AI and more. Our aim was to understand their limitations and define a more context-aware approach.",
      image: "/About-images/TAB article.png",
    },
    {
      title: "Dataset Exploration and Preprocessing",
      icon: <Database size={35} />,
      category: "data",
      description:
        "We used datasets like the PII Detection Dataset and Text Anonymization Benchmark. We parsed structured annotations, mapped entity labels, and split the data into training, validation, and test sets.",
      image: "/About-images/dataset image.png",
    },
    {
      title: "Named Entity Recognition (NER)",
      icon: <Microscope size={35} />,
      category: "development",
      description:
        "We trained a spaCy-based NER model to extract entities such as names, IDs, and addresses. It achieved 71.85% accuracy and replaced sensitive tokens using placeholders like <PERSON>.",
      image: "/About-images/ner training 1.png",
    },
    {
      title: "LLM-Based Classification",
      icon: <BrainCircuit size={35} />,
      category: "development",
      description:
        "We evaluated GPT-2, T5, GPT-3.5-turbo, and GPT-4o-mini. By binarizing named entities as sensitive or non-sensitive, we achieved more precise masking while maintaining context.",
      image: "/About-images/gpt 4o mini score.png",
    },
    {
      title: "System Optimization",
      icon: <Calculator size={35} />,
      category: "development",
      description:
        "We refined prompts, tested assistant, and optimized speed and masking reliability throughout the pipeline.",
      image: "/About-images/prompt engineering.png",
    },
    {
      title: "Metrics and Evaluation",
      icon: <ChartCandlestick size={35} />,
      category: "evaluation",
      description:
        "We measured cosine similarity to evaluate semantic preservation and used precision, recall, and F1 scores for classification. Our best cosine similarity score averaged 0.91.",
      image: "/About-images/cosine similarity score.png",
    },
    {
      title: "Experiments and Insights",
      icon: <TestTubeDiagonal size={35} />,
      category: "evaluation",
      description:
        "We analyzed the relationship between the number of named entities and similarity scores. The results showed that entity quantity didn't strongly affect output similarity.",
      image: "/About-images/colleration number of NEs to cosine similarity.png",
    },
    {
      title: "Final Deployment",
      icon: <Earth size={35} />,
      category: "deployment",
      description:
        "Built with Django (backend), React (frontend), and MongoDB (database). Users can upload, anonymize, view, and download documents easily with a clean UI.",
      image: "/About-images/architecture.png",
    },
  ];

  const categoryColors = {
    research: "bg-amber-100 text-amber-800",
    data: "bg-emerald-100 text-emerald-800",
    development: "bg-sky-100 text-sky-800",
    evaluation: "bg-violet-100 text-violet-800",
    deployment: "bg-rose-100 text-rose-800",
  };

  const filteredSteps =
    activeFilter === "all"
      ? steps
      : steps.filter((step) => step.category === activeFilter);

  const categories = ["all", ...new Set(steps.map((step) => step.category))];

  const openModal = (image) => {
    if (image) {
      setModalImage(image);
      document.body.style.overflow = "hidden";
    }
  };

  const closeModal = () => {
    setModalImage(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-extrabold text-[#0e5266] tracking-tight mb-4">
            Project Development Journey
          </h1>
          <p className="text-xl text-gray-500">
            From research to deployment, explore each phase of our anonymization
            system development
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                activeFilter === category
                  ? "bg-[#f96e2a] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSteps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-default flex flex-col h-full"
            >
              {/* Card header */}
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mr-2">
                    {index + 1 + ". " + step.title}
                  </h3>
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {step.description}
                </p>
                <div className="mt-auto">
                  <span
                    className={`text-xs cursor-pointer font-bold px-3 py-1 rounded-full w-fit ${
                      categoryColors[step.category]
                    }`}
                    onClick={() => setActiveFilter(step.category)}
                  >
                    {step.category}
                  </span>
                </div>
              </div>

              {/* Image or empty space section */}
              <div className="mt-auto">
                {step.image && (
                  <div
                    className="h-48 overflow-hidden bg-gray-100 border-t border-gray-100 cursor-pointer relative group flex items-center justify-center"
                    onClick={() => openModal(step.image)}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                        Click to enlarge
                      </span>
                    </div>
                    <img
                      src={`assets${step.image}`}
                      alt={`${step.title} Illustration`}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center p-1 rounded-full bg-indigo-100 mb-4">
            <span className="px-3 py-1 text-sm font-medium text-indigo-800">
              Project Timeline
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            An 8-step journey to privacy-preserving text anonymization
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500">
            Our system combines traditional NER with advanced LLM-based
            classification to achieve high-quality anonymization while
            preserving text meaning.
          </p>
        </div>
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative">
            {/* Modal content */}
            <div className="w-full h-120 flex items-center justify-center bg-gray-100 p-6">
              <img
                src={`assets${modalImage}`}
                alt="Enlarged view"
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
