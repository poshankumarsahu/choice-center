import { FaCheckCircle, FaHandshake, FaUsers, FaTools } from "react-icons/fa";
import logo from "../assets/images/logo.jpg";

const About = () => {
  const services = [
    "पैन कार्ड बनवाना और सुधार कराना",
    "परीक्षा फॉर्म भरना (B.A., B.Com., B.Sc. आदि)",
    "टाइपिंग और अनुवाद सेवाएं",
    "रेज़्यूमे/सीवी डिज़ाइन",
    "पासपोर्ट साइज फोटो और एडिटिंग",
    "छत्तीसगढ़ संगठित श्रमिक कार्ड बनवाना",
    "आधार, मोबाइल और बैंक से जुड़ी सहायता",
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-center">
        <img
          src={logo}
          alt="Digital Dost Logo"
          className="mx-auto w-24 h-24 rounded-full shadow-lg mb-4 border-4 border-white"
        />
        <h1 className="text-3xl font-bold text-white mb-2">डिजिटल दोस्त</h1>
        <p className="text-blue-100">आपका भरोसेमंद डिजिटल साथी</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6 p-6">
        {/* About Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow md:col-span-2">
          <div className="flex items-center mb-4">
            <FaUsers className="text-2xl text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">
              हमारे बारे में
            </h3>
          </div>
          <p className="text-gray-600">
            डिजिटल दोस्त एक भरोसेमंद और सस्ता डिजिटल सेवा केंद्र है, जहां आपको
            हर तरह की ऑनलाइन सेवाएं मिलती हैं - बिना किसी झंझट के । हमारा मिशन
            है हर छात्र, नौजवान और ग्राहक तक डिजिटल सुविधाएं पाएं - एक ही जगह,
            एक ही प्लेटफॉर्म पर।
          </p>
        </div>

        {/* Services Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FaTools className="text-2xl text-green-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">
              हमारी सेवाएं
            </h3>
          </div>
          <ul className="space-y-3">
            {services.map((service, index) => (
              <li key={index} className="flex items-center text-gray-600">
                <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>{service}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Commitment Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FaHandshake className="text-2xl text-purple-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">
              हमारी प्रतिज्ञा
            </h3>
          </div>
          <p className="text-gray-600">
            आप बस फॉर्म भरिएगा, बाकी का काम हम करेंगे – डिजिटल दोस्त आपका अपना
            डिजिटल साथी है, हर जरूरत के लिए।
          </p>
          <div className="mt-4 bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
            <p className="text-purple-800 font-medium text-center">
              24/7 आपकी सेवा में।
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-gray-50 px-6 py-4 text-center border-t">
        <p className="text-gray-600">
          डिजिटल दोस्त - Transforming Digital Services
        </p>
      </div>
    </div>
  );
};

export default About;
