import { useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  FaUsers,
  FaFileAlt,
  FaClock,
  FaDownload,
  FaSpinner,
  FaPhone,
  FaUserAlt,
  FaFileImage,
} from "react-icons/fa";

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState({});
  const [deleting, setDeleting] = useState({});
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
    const fetchSubmissions = async () => {
      try {
        if (userLoading) return;
        if (!user) {
          navigate("/login");
          return;
        }

        setLoading(true);
        const submissionsRef = collection(db, "submissions");
        const q = query(submissionsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const submissionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: new Date(doc.data().createdAt),
          mainFiles: doc.data().mainFiles || [],
          otherFiles: doc.data().otherFiles || [],
        }));

        setSubmissions(submissionsData);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [user, userLoading, navigate]);

  const handleDelete = async (submissionId) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      setDeleting((prev) => ({ ...prev, [submissionId]: true }));
      const submissionRef = doc(db, "submissions", submissionId);
      await deleteDoc(submissionRef);

      // Remove from local state
      setSubmissions((prev) => prev.filter((sub) => sub.id !== submissionId));
    } catch (error) {
      console.error("Error deleting submission:", error);
      alert("Failed to delete submission");
    } finally {
      setDeleting((prev) => ({ ...prev, [submissionId]: false }));
    }
  };

  const renderFilesList = (files) => {
    if (!files || files.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {files.map((file, index) => (
          <a
            key={index}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-sm text-blue-600 hover:bg-blue-100"
          >
            <FaFileImage className="w-4 h-4" />
            <span className="truncate max-w-[150px]">{file.fileName}</span>
            <FaDownload className="w-3 h-3" />
          </a>
        ))}
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Admin Dashboard
        </h2>
        <p className="text-blue-100 text-sm sm:text-base">
          Manage your submissions and files
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-3 sm:mb-4">
            <FaUsers className="text-xl sm:text-2xl text-blue-600 mr-2 sm:mr-3" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              Total Users
            </h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">
            {new Set(submissions.map((s) => s.mobile)).size}
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FaFileAlt className="text-2xl text-green-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Total Files</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {submissions.reduce(
              (acc, sub) =>
                acc +
                (sub.mainFiles?.length || 0) +
                (sub.otherFiles?.length || 0),
              0
            )}
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FaClock className="text-2xl text-purple-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">
              Latest Update
            </h3>
          </div>
          <p className="text-gray-600">
            {submissions[0]?.timestamp.toLocaleDateString() || "No submissions"}
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div className="flex items-center">
              <FaUsers className="text-xl sm:text-2xl text-blue-600 mr-2 sm:mr-3" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
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
                className="bg-white p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                  <div className="space-y-2 w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <FaUserAlt className="text-gray-400" />
                      <h3 className="font-medium text-gray-900 break-all">
                        {submission.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-400" />
                      <p className="text-sm text-gray-600 break-all">
                        {submission.mobile}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      Submitted:{" "}
                      {new Date(submission.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(submission.id)}
                    disabled={deleting[submission.id]}
                    className={`w-full sm:w-auto px-3 py-1 text-xs rounded-full flex items-center justify-center gap-1
                      ${
                        deleting[submission.id]
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                  >
                    {deleting[submission.id] ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                    {deleting[submission.id] ? "Deleting..." : "Delete"}
                  </button>
                </div>

                {submission.mainFiles?.length > 0 && (
                  <div className="mt-3 sm:mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Main Files
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {renderFilesList(submission.mainFiles)}
                    </div>
                  </div>
                )}

                {submission.otherFiles?.length > 0 && (
                  <div className="mt-3 sm:mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Other Files
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {renderFilesList(submission.otherFiles)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 text-center border-t">
        <p className="text-gray-600 text-sm sm:text-base">
          Admin Dashboard - Manage All Your Services
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
