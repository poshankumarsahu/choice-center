import { useNavigate } from "react-router-dom";
import { FaGlobe, FaDesktop, FaPen, FaPlane } from "react-icons/fa";

const Services = () => {
  const navigate = useNavigate();
  const services = [
    {
      title: "सरकारी सेवा",
      icon: <FaGlobe className="text-2xl text-blue-600 mr-3" />,
      description: "आवश्यक सरकारी सेवाएं आपकी सुविधा के लिए",
      options: [
        "PAN कार्ड आवेदन/अपडेट",
        "मतदाता पहचान पत्र आवेदन/अपडेट",
        "आधार आवेदन/अपडेट",
        "राशन कार्ड आवेदन/अपडेट",
        "आय प्रमाण पत्र आवेदन",
        "जाति प्रमाण पत्र आवेदन",
        "निवास प्रमाण पत्र आवेदन",
        "जन्म प्रमाण पत्र आवेदन",
      ],
    },
    {
      title: "डिजिटल सेवा",
      icon: <FaDesktop className="text-2xl text-green-600 mr-3" />,
      description: "आपकी दैनिक डिजिटल आवश्यकताओं के लिए समाधान",
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
      title: "ऑनलाइन आवेदन",
      icon: <FaPen className="text-2xl text-red-600 mr-3" />,
      description: "आसान ऑनलाइन आवेदन सहायता",
      options: [
        "स्कॉलरशिप आवेदन",
        "कॉलेज प्रवेश फॉर्म",
        "प्रतियोगी परीक्षा फॉर्म",
        "रिज़्यूमे/CV आवेदन",
        "ऑनलाइन परीक्षा आवेदन सहायता",
      ],
    },
    {
      title: "यात्रा और बुकिंग",
      icon: <FaPlane className="text-2xl text-purple-600 mr-3" />,
      description: "सभी यात्रा आवश्यकताओं के लिए एक स्थान",
      options: [
        "IRCTC टिकट बुकिंग",
        "बस टिकट बुकिंग",
        "फ्लाइट टिकट बुकिंग",
        "होटल बुकिंग",
      ],
    },
  ];

  const handleServiceClick = (option) => {
    navigate("/submit-form", {
      state: { serviceName: option },
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">हमारी सेवाएं</h2>
        <p className="text-blue-100">
          आपकी सभी डॉक्यूमेंट आवश्यकताओं के लिए समाधान
        </p>
      </div>

      {/* Services Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6 p-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              {service.icon}
              <h3 className="text-xl font-semibold text-gray-800">
                {service.title}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <div className="space-y-2">
              {service.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={() => handleServiceClick(option)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                    {option}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="bg-gray-50 px-6 py-4 text-center border-t">
        <p className="text-gray-600">24/7 ऑनलाइन सेवाएं उपलब्ध हैं</p>
      </div>
    </div>
  );
};

export default Services;
