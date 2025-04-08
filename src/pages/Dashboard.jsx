import { useState, useEffect } from "react";
import axios from "axios";
import { ThumbsUp } from "lucide-react";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [postsResponse, profileResponse] = await Promise.all([
          axios.get("${import.meta.env.VITE_BASE_URL}/api/posts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("${import.meta.env.VITE_BASE_URL}/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Fetch user profiles for each post
        const posts = postsResponse.data.data.posts;
        const postsWithUsers = await Promise.all(
          posts.map(async (post) => {
            if (post.user_id === profileResponse.data.data.user.id) {
              return { ...post, user: profileResponse.data.data.user };
            }
            try {
              const userResponse = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/profile/${post.user_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return { ...post, user: userResponse.data.data.user };
            } catch (error) {
              return {
                ...post,
                user: { first_name: "Unknown", last_name: "User" },
              };
            }
          })
        );

        setPosts(postsWithUsers);
        setUserProfile(profileResponse.data.data.user);
        setPagination({
          page: postsResponse.data.data.pagination.page,
          limit: postsResponse.data.data.pagination.limit,
          total: postsResponse.data.data.pagination.total,
          hasMore: postsResponse.data.data.pagination.has_more,
        });
      } catch (error) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "${import.meta.env.VITE_BASE_URL}/api/posts",
        { content: newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add the new post to the posts array with user data
      const newPostWithUser = {
        ...response.data.data,
        user: userProfile, // Use the profile data instead of localStorage
        likes_count: 0,
        comments_count: 0,
      };

      setPosts([newPostWithUser, ...posts]);
      setNewPost("");
      setIsCreating(false);
    } catch (error) {
      setError("Failed to create post");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the likes count in the local state
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              likes_count: response.data.data.likes_count,
              is_liked: response.data.data.is_liked,
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Post
          </button>
        </div>

        {isCreating && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <form onSubmit={handleCreatePost}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="w-full p-2 border rounded-lg mb-4"
                rows="4"
                placeholder="What's on your mind?"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewPost("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No posts yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">
                      {post.user_id === userProfile?.id
                        ? `${userProfile.first_name[0]}${userProfile.last_name[0]}`
                        : `${post.user?.first_name?.[0]}${post.user?.last_name?.[0]}`}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">
                      {post.user_id === userProfile?.id
                        ? `${userProfile.first_name} ${userProfile.last_name}`
                        : `${post.user?.first_name} ${post.user?.last_name}`}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
