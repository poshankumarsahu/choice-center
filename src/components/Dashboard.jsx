import { useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  FaUsers,
  FaFileAlt,
  FaClock,
  FaDownload,
  FaSpinner,
} from "react-icons/fa";

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState({});
  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);

  // Calculate total files
  const getTotalFiles = () => {
    return submissions.reduce((total, submission) => {
      const mainFilesCount = submission.mainFiles?.length || 0;
      const otherFilesCount = submission.otherFiles?.length || 0;
      return total + mainFilesCount + otherFilesCount;
    }, 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userLoading) return;

        if (!user) {
          navigate("/login");
          return;
        }

        if (user.email !== import.meta.env.VITE_ADMIN_EMAIL) {
          navigate("/login");
          return;
        }

        setLoading(true);
        setError(null);

        const submissionsQuery = query(
          collection(db, "submissions"),
          orderBy("timestamp", "desc")
        );

        const snapshot = await getDocs(submissionsQuery);
        const submissionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp:
            doc.data().timestamp instanceof Timestamp
              ? doc.data().timestamp.toDate()
              : new Date(doc.data().timestamp),
        }));

        setSubmissions(submissionsData);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userLoading, navigate]);

  const renderFilesList = (submission, fileType) => {
    const files =
      fileType === "main" ? submission.mainFiles : submission.otherFiles;

    if (!files || files.length === 0) return null;

    return (
      <div className="mt-2">
        <h4 className="text-sm font-medium text-gray-700 mb-1">
          {fileType === "main" ? "Main Files" : "Other Files"}:
        </h4>
        <div className="space-y-1">
          {files.map((file, index) => (
            <a
              key={index}
              href={file.fileUrl}
              download={file.fileName}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <FaFileAlt className="flex-shrink-0" />
              <span className="truncate">{file.fileName}</span>
              <FaDownload className="flex-shrink-0" />
            </a>
          ))}
        </div>
      </div>
    );
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
        <p className="text-blue-100">Manage your submissions and files</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 p-6">
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FaUsers className="text-2xl text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Submissions</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {submissions.length}
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FaFileAlt className="text-2xl text-green-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Total Files</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{getTotalFiles()}</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FaClock className="text-2xl text-purple-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Last Update</h3>
          </div>
          <p className="text-gray-600">
            {submissions[0]?.timestamp.toLocaleDateString() || "No submissions"}
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FaDownload className="text-2xl text-rose-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Downloads</h3>
          </div>
          <p className="text-3xl font-bold text-rose-600">
            {submissions.reduce((acc, sub) => acc + (sub.downloads || 0), 0)}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaUsers className="text-2xl text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">
                Recent Submissions
              </h3>
            </div>
            <span className="text-sm text-gray-500">
              Total: {submissions.length}
            </span>
          </div>

          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {submission.name}
                    </h3>
                    <p className="text-sm text-gray-600">{submission.mobile}</p>
                    <p className="text-sm text-gray-500">
                      {submission.serviceName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {submission.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      submission.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {submission.status || "pending"}
                  </span>
                </div>

                {renderFilesList(submission, "main")}
                {renderFilesList(submission, "other")}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 text-center border-t">
        <p className="text-gray-600">
          Admin Dashboard - Manage All Your Services
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
