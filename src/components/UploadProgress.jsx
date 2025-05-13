const UploadProgress = ({ uploadProgress, totalFiles }) => {
  const completedFiles = Object.keys(uploadProgress).length;
  const overallProgress =
    Object.values(uploadProgress).reduce((acc, curr) => acc + curr, 0) /
    (Object.keys(uploadProgress).length || 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">
            Uploading Files ({completedFiles}/{totalFiles})
          </h3>

          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="truncate max-w-[200px]">{fileName}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-gray-600 text-sm text-center mt-4">
            Please don't close this window while uploading
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadProgress;
