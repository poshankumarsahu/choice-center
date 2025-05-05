import logo from "../assets/images/logo.jpg";

const Footer = () => {
  return (
    <footer className="w-full bg-white shadow-sm mt-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img src={logo} className="h-8" alt="BK Studio Logo" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BK Studio
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0">
            <li>
              <a
                href="/about"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 me-4 md:me-6"
              >
                हमारे बारे में
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 me-4 md:me-6"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 me-4 md:me-6"
              >
                Licensing
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                संपर्क करें
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-4 border-gray-200" />
        <span className="block text-sm text-gray-700 text-center">
          © 2024{" "}
          <a
            href="/"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            BK Studio
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
