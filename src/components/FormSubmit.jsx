import { useState } from "react";
import {
  FaFileUpload,
  FaTrash,
  FaCheckCircle,
  FaWhatsapp,
  FaPhone,
  FaUser,
  FaMobile,
} from "react-icons/fa";
import { submitForm } from "../services/api";
import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const FormSubmit = ({ serviceName = "Document" }) => {
  const [mainFiles, setMainFiles] = useState([]);
  const [otherFiles, setOtherFiles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const numbersOnly = value.replace(/[^\d]/g, "");
      if (numbersOnly.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: numbersOnly }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMainFileChange = (e) => {
    if (e.target.files) {
      setMainFiles((prevFiles) => [
        ...prevFiles,
        ...Array.from(e.target.files),
      ]);
    }
  };

  const handleOtherFilesChange = (e) => {
    if (e.target.files) {
      setOtherFiles((prevFiles) => [
        ...prevFiles,
        ...Array.from(e.target.files),
      ]);
    }
  };

  const removeMainFile = (index) => {
    setMainFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const removeOtherFile = (index) => {
    setOtherFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const uploadFileToFirebase = async (file, fileType) => {
    try {
      const timestamp = Date.now();
      const storageRef = ref(
        storage,
        `submissions/${formData.mobile}/${fileType}/${timestamp}_${file.name}`
      );
      const uploadResult = await uploadBytes(storageRef, file);
      return await getDownloadURL(uploadResult.ref);
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("mobile", formData.mobile);
      formDataToSend.append("serviceName", serviceName);

      // Upload main files to Firebase
      const mainFileUrls = await Promise.all(
        mainFiles.map((file) => uploadFileToFirebase(file, "main"))
      );

      // Upload other files to Firebase
      const otherFileUrls = await Promise.all(
        otherFiles.map((file) => uploadFileToFirebase(file, "other"))
      );

      formDataToSend.append("mainFileUrls", JSON.stringify(mainFileUrls));
      formDataToSend.append("otherFileUrls", JSON.stringify(otherFileUrls));

      const response = await submitForm(formDataToSend);

      if (response.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setMainFiles([]);
          setOtherFiles([]);
          setFormData({ name: "", mobile: "" });
        }, 3000);
      } else {
        // Show error from API if available
        alert(
          response.data?.message || "Error submitting form. Please try again."
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error uploading files. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          दस्तावेज़ (Documents) अपलोड करें
        </h2>
        <p className="text-blue-100">कृपया सभी आवश्यक दस्तावेज़ अपलोड करें</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <FaUser className="text-2xl text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">
                अपना नाम दर्ज करें
              </h3>
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="नाम दर्ज करें"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              required
            />
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <FaMobile className="text-2xl text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">
                मोबाइल नंबर दर्ज करें
              </h3>
            </div>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="10 अंकों का मोबाइल नंबर"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
              pattern="[0-9]{10}"
              maxLength="10"
              inputMode="numeric"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <FaFileUpload className="text-2xl text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">
                दस्तावेज़ अपलोड करें {serviceName}
              </h3>
            </div>
            <div className="space-y-4">
              <input
                type="file"
                onChange={handleMainFileChange}
                className="hidden"
                id="mainFile"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="mainFile"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
              >
                फाइल चुनें
              </label>
              {mainFiles.length > 0 && (
                <div className="space-y-2">
                  {mainFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-blue-50 p-3 rounded-lg"
                    >
                      <span className="text-blue-700 truncate">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeMainFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <FaFileUpload className="text-2xl text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">
                अन्य दस्तावेज़
              </h3>
            </div>
            <div className="space-y-4">
              <input
                type="file"
                onChange={handleOtherFilesChange}
                className="hidden"
                id="otherFiles"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="otherFiles"
                className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer"
              >
                फाइल चुनें
              </label>
              {otherFiles.length > 0 && (
                <div className="space-y-2">
                  {otherFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-green-50 p-3 rounded-lg"
                    >
                      <span className="text-green-700 truncate">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeOtherFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={
                isSubmitting ||
                (mainFiles.length === 0 && otherFiles.length === 0)
              }
              className={`px-6 py-2 text-sm rounded-lg font-medium text-white transition-colors
                ${
                  isSubmitting ||
                  (mainFiles.length === 0 && otherFiles.length === 0)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-rose-500 hover:bg-rose-600"
                }`}
            >
              {isSubmitting ? "Submitting..." : "Upload Files"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <a
              href="https://wa.me/YOUR_PHONE_NUMBER"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <FaWhatsapp className="text-xl mr-2" />
              <span className="text-sm sm:text-base">
                व्हाट्सएप पर चैट करें
              </span>
            </a>

            <a
              href="tel:YOUR_PHONE_NUMBER"
              className="flex items-center justify-center px-4 py-3 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              <FaPhone className="text-xl mr-2" />
              <span className="text-sm sm:text-base">कॉल करें</span>
            </a>
          </div>
        </div>
      </form>

      {isSubmitted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Success!
            </h3>
            <p className="text-gray-600">
              आपके दस्तावेज़ सबमिट कर दिए गए हैं ।
            </p>
          </div>
        </div>
      )}

      <div className="bg-gray-50 px-6 py-4 text-center border-t">
        <p className="text-gray-600">
          कृपया सुनिश्चित करें कि सभी दस्तावेज़ स्पष्ट और पठनीय हों।
        </p>
      </div>
    </div>
  );
};

export default FormSubmit;
