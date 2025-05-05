import { FaWhatsapp, FaEnvelope, FaRupeeSign, FaPhone } from "react-icons/fa";

const Contact = () => {
  const phoneNumber = "6261748370";
  const email = "centeronlineservice722@gmail.com";
  const businessEmail = "bhupeshsahu917@gmail.com";
  const upiId = "bhupeshsahu917@ybl";

  const handleWhatsApp = () => {
    window.open(`https://wa.me/91${phoneNumber}`, "_blank");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">संपर्क करें</h2>
        <p className="text-blue-100">हम आपकी मदद के लिए 24/7 उपलब्ध हैं।</p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6 p-6">
        {/* Phone Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FaPhone className="text-2xl text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">
              हमें कॉल करें
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            तुरंत सहायता चाहिए? अभी कॉल करें!
          </p>
          <a
            href={`tel:${phoneNumber}`}
            className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            कॉल करें
          </a>
        </div>

        {/* WhatsApp Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FaWhatsapp className="text-2xl text-green-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">व्हाट्सएप</h3>
          </div>
          <p className="text-gray-600 mb-4">हमसे व्हाट्सएप पर बातचीत करें</p>
          <button
            onClick={handleWhatsApp}
            className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            चैट शुरू करें
          </button>
        </div>

        {/* Email Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FaEnvelope className="text-2xl text-red-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">
              हमें ईमेल करें
            </h3>
          </div>
          <p className="text-gray-600 mb-4">सामान्य पूछताछ:</p>
          <a
            href={`mailto:${email}`}
            className="block w-full bg-red-600 text-white text-center py-3 rounded-lg hover:bg-red-700 transition-colors font-medium mb-4"
          >
            ईमेल भेजें
          </a>
          <p className="text-gray-600 mb-4">व्यावसायिक पूछताछ:</p>
          <a
            href={`mailto:${businessEmail}`}
            className="block w-full bg-red-600 text-white text-center py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            ईमेल भेजें
          </a>
        </div>

        {/* UPI Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FaRupeeSign className="text-2xl text-purple-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">
              UPI Payment (भुगतान)
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            UPI के माध्यम से आसानी से भुगतान करें:
          </p>
          <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
            <p className="text-purple-800 font-medium text-center select-all">
              {upiId}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-gray-50 px-6 py-4 text-center border-t">
        <p className="text-gray-600">आपकी डिजिटल जरूरतों के लिए 24/7 उपलब्ध</p>
      </div>
    </div>
  );
};

export default Contact;
