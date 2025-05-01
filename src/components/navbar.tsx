export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 h-16">
      <div className="text-2xl font-bold text-blue-600">UM-Tracker</div>
      <div className="flex space-x-4">
        <a href="/" className="text-gray-700 hover:text-blue-600">
          Home
        </a>
        <a href="/about" className="text-gray-700 hover:text-blue-600">
          About
        </a>
        <a href="/contact" className="text-gray-700 hover:text-blue-600">
          Contact
        </a>
        <a href="/login" className="text-gray-700 hover:text-blue-600">
          Login
        </a>
      </div>
    </nav>
  );
};
