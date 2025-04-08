import { useState, useEffect } from "react";
import axios from "axios";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile/connections`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setConnections(response.data.data);
      } catch (error) {
        setError("Failed to load connections");
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-600 text-center p-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Connections</h1>

        {connections.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No connections yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="bg-white p-4 rounded-lg shadow"
              >
                {/* Connection card content will go here when you have connections */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
