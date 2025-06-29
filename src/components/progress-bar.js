function ProgressLoader(props) {
  if (!props.isDownloading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white px-6 py-5 rounded-xl shadow-lg text-center w-80">
        <p className="text-base font-semibold mb-3 text-gray-800">
          Downloading... {props.downloadProgress}%
        </p>
        <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${props.downloadProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default ProgressLoader;
