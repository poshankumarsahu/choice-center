import { useState, useEffect } from "react";
import { auth, db, storage } from "../config/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaUsers, FaFileAlt, FaClock, FaDownload } from "react-icons/fa";

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);

  // Add this helper function to fetch files from a directory
  const fetchFilesFromDirectory = async (directory) => {
    try {
      const dirRef = ref(storage, directory);
      const dirList = await listAll(dirRef);

      const filesPromises = dirList.items.map(async (item) => {
        try {
          const url = await getDownloadURL(item);
          return {
            name: item.name,
            url,
            path: item.fullPath,
            directory: directory.split("/")[1], // Get the user's mobile number
            timestamp: new Date(),
          };
        } catch (err) {
          console.error(`Error getting download URL for ${item.name}:`, err);
          return null;
        }
      });

      return Promise.all(filesPromises);
    } catch (err) {
      console.error(`Error listing files in ${directory}:`, err);
      return [];
    }
  };

  useEffect(() => {
    if (userLoading) return;

    if (!user || user.email !== import.meta.env.VITE_ADMIN_EMAIL) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);

        // Wait for fresh token before proceeding
        await user.getIdToken(true);

        // Fetch Firestore data first
        const submissionsQuery = query(
          collection(db, "submissions"),
          orderBy("timestamp", "desc")
        );

        const submissionsSnapshot = await getDocs(submissionsQuery);
        const submissionsData = submissionsSnapshot.docs.map((doc) => {
          const data = doc.data();
          // Convert Firestore Timestamp to JavaScript Date
          const timestamp =
            data.timestamp instanceof Timestamp
              ? data.timestamp.toDate()
              : new Date(data.timestamp);

          return {
            id: doc.id,
            ...data,
            timestamp,
            // Ensure these fields exist
            name: data.name || "N/A",
            mobile: data.mobile || "N/A",
            serviceName: data.serviceName || "N/A",
            downloads: data.downloads || 0,
          };
        });

        console.log("Submissions data:", submissionsData); // Debug log
        setSubmissions(submissionsData);

        // Fetch Storage files from all subdirectories
        const rootRef = ref(storage, "submissions");
        const rootList = await listAll(rootRef);

        // Fetch files from each subdirectory
        const allFilesPromises = rootList.prefixes.map((prefix) =>
          fetchFilesFromDirectory(prefix.fullPath)
        );

        const allFilesArrays = await Promise.all(allFilesPromises);
        const allFiles = allFilesArrays.flat().filter(Boolean);

        console.log("All files:", allFiles);
        setFiles(allFiles);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, user, userLoading]);

  // Render submissions table
  const renderSubmissionsTable = () => {
    if (submissions.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
            No submissions found
          </td>
        </tr>
      );
    }

    return submissions.map((submission) => (
      <tr key={submission.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {submission.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {submission.mobile}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {submission.serviceName}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {submission.timestamp?.toLocaleDateString() || "N/A"}
        </td>
      </tr>
    ));
  };

  // Update the renderFilesGrid function to show directory information
  const renderFilesGrid = () => {
    if (files.length === 0) {
      return (
        <div className="col-span-full text-center text-gray-500 py-4">
          No files uploaded yet
        </div>
      );
    }

    return files.map((file) => (
      <a
        key={file.path}
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaFileAlt className="w-6 h-6 text-blue-500" />
            <span className="ml-2 text-sm text-gray-600 truncate">
              {file.name}
            </span>
          </div>
          <span className="text-xs text-gray-400">{file.directory}</span>
        </div>
      </a>
    ));
  };

  // Show loading state
  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state
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
          <p className="text-3xl font-bold text-green-600">{files.length}</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FaClock className="text-2xl text-purple-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Last Update</h3>
          </div>
          <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
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

      {/* Recent Submissions */}
      <div className="p-6">
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {renderSubmissionsTable()}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      <div className="p-6">
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaFileAlt className="text-2xl text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">
                Uploaded Files
              </h3>
            </div>
            <span className="text-sm text-gray-500">Total: {files.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {renderFilesGrid()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 text-center border-t">
        <p className="text-gray-600">
          Admin Dashboard - Manage All Your Services
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
