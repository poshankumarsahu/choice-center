import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    navigate("/submit-form", {
      state: { serviceName: option },
    });
  };

  const tabs = [
    {
      id: 1,
      name: "सरकारी सेवा",
      options: [
        "PAN कार्ड",
        "मतदाता पहचान पत्र",
        "आधार कार्ड",
        "राशन कार्ड",
        "आय प्रमाण पत्र",
        "जाति प्रमाण पत्र",
        "निवास प्रमाण पत्र",
        "जन्म प्रमाण पत्र",
      ],
    },
    {
      id: 2,
      name: "डिजिटल सेवा",
      options: [
        "PDF संपादित, मर्ज, कंप्रेस करें",
        "दस्तावेज़ टाइपिंग",
        "ईमेल लिखना",
        "आवेदन पत्र लिखना",
        "फोटो का आकार बदलना/संपादित करना",
        "ऑनलाइन बिल भुगतान",
      ],
    },
    {
      id: 3,
      name: "ऑनलाइन आवेदन",
      options: [
        "स्कॉलरशिप आवेदन",
        "कॉलेज प्रवेश फॉर्म",
        "प्रतियोगी परीक्षा फॉर्म",
        "रिज़्यूमे/CV आवेदन",
        "ऑनलाइन परीक्षा आवेदन",
      ],
    },
    {
      id: 4,
      name: "यात्रा और बुकिंग",
      options: [
        "IRCTC टिकट बुकिंग",
        "बस टिकट बुकिंग",
        "फ्लाइट टिकट बुकिंग",
        "होटल बुकिंग",
      ],
    },
  ];

  return (
    <div className="w-full bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-1 sm:px-4">
        <nav className="flex justify-between items-center">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="relative flex-1"
              onMouseEnter={() => setActiveTab(tab.id)}
              onMouseLeave={() => setActiveTab(null)}
            >
              <button
                className={`
                  w-full
                  px-1 sm:px-4 py-2 sm:py-3
                  text-[8px] sm:text-sm font-medium
                  transition-colors duration-200
                  border-b-2
                  ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600"
                  }
                  hover:text-blue-600
                  focus:outline-none
                `}
              >
                <span className="inline-flex items-center justify-center gap-0.5 whitespace-normal leading-tight">
                  {tab.name}
                  <svg
                    className={`h-2 w-2 sm:h-4 sm:w-4 transition-transform duration-200 flex-shrink-0 ${
                      activeTab === tab.id ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>

              {activeTab === tab.id && (
                <div className="absolute z-20 w-48 sm:w-56 mt-1 left-0 bg-white rounded-lg shadow-xl border border-gray-100">
                  <div className="py-2">
                    {tab.options.length > 0 ? (
                      tab.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="block w-full text-left px-4 py-2 text-[8px] sm:text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        >
                          {option}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-[8px] sm:text-sm text-gray-500">
                        No options available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Tabs;
