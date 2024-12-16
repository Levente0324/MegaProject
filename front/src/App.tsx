import "./App.css";
import { Outlet, Link } from "react-router-dom";

const App = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <nav className="flex justify-between items-center">
          <div>
            <Link
              className="px-3 py-2 rounded hover:bg-blue-700"
              to="/products"
            >
              Termékek
            </Link>
            <Link className="px-3 py-2 rounded hover:bg-blue-700" to="/cart">
              Kosár
            </Link>
            <Link className="px-3 py-2 rounded hover:bg-blue-700" to="/profile">
              Profil
            </Link>
          </div>
          <button
            className="px-3 py-2 rounded bg-red-500 hover:bg-red-700"
            onClick={handleLogout}
          >
            Kijelentkezés
          </button>
        </nav>
      </header>
      <main className="flex-grow p-4 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
