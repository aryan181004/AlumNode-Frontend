import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8000/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data.data);
      } catch (error) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-600 text-center p-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-xl font-semibold">
              {profile.user.first_name} {profile.user.last_name}
            </h2>
            <div className="mt-2 space-y-1 text-gray-600">
              <p>
                <span className="font-medium">Email:</span> {profile.user.email}
              </p>
              <p>
                <span className="font-medium">College Email:</span>{" "}
                {profile.user.college_email}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {profile.user.is_alumini ? "Alumni" : "Student"}
              </p>
              <p>
                <span className="font-medium">Member Since:</span>{" "}
                {new Date(profile.user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="text-sm font-medium text-gray-700">Posts</h3>
              <p className="text-2xl font-bold mt-1">{profile.stats.posts}</p>
            </div>
            {/* <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="text-sm font-medium text-gray-700">Connections</h3>
              <p className="text-2xl font-bold mt-1">
                {profile.stats.connections}
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
