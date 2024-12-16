import { useState } from "react";

const Profile = () => {
  const [username, setUsername] = useState("");

  const handleUsernameChange = async () => {
    const token = localStorage.getItem("token");

    if (!username) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, username }),
      });

      const data = await response.json();

      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Profil</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Új felhasználónév:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-2"
        />
      </div>
      <button
        onClick={handleUsernameChange}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Módosítás
      </button>
    </div>
  );
};

export default Profile;
