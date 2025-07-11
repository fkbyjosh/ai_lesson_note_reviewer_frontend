
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
const Footer = () => {
  return (
    <footer className="bg-background py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2">
              <Logo className="h-8 w-8" />
              <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                Family Care Schools
              </span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Enhancing teaching quality through AI-powered lesson note reviews.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-skyBlue transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-600 dark:text-gray-300 hover:text-skyBlue transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/lesson-notes"
                  className="text-gray-600 dark:text-gray-300 hover:text-skyBlue transition-colors"
                >
                  Review Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-skyBlue transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Contact
            </h3>
            <address className="not-italic text-gray-600 dark:text-gray-300">
              <p>Family Care Schools</p>
              <p>
                AG1028 Arthill Street 
                <br />
                CE-095-3690
              </p>
              <p>Email: info@familycareschools.edu</p>
              <p>Phone: +233 20 680 5570</p>
            </address>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-gray-500 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Family Care Schools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
