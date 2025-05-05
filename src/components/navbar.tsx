import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 h-16">
      <div className="text-2xl font-bold text-blue-600">UM-Tracker</div>
      <div className="flex space-x-4">
        <Link href="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>
        <Link href="/about" className="text-gray-700 hover:text-blue-600">
          About
        </Link>
        <Link href="/contact" className="text-gray-700 hover:text-blue-600">
          Contact
        </Link>
        <Link href="/login" className="text-gray-700 hover:text-blue-600">
          Login
        </Link>
      </div>
    </nav>
  );
};
