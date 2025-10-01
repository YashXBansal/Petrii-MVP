import { useState, useEffect } from "react";
import api from "../services/api";
import type { User, Dataset } from "../types";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [usersRes, datasetsRes] = await Promise.all([
        api.get<User[]>("/admin/users"),
        api.get<Dataset[]>("/admin/datasets"),
      ]);
      setUsers(usersRes.data);
      setDatasets(datasetsRes.data);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    userId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { status });
      fetchData();
    } catch (error) {
      console.error("Failed to update user status", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading admin data...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <div className="space-y-3">
          {users.length > 0 ? (
            users.map((u) => (
              <div
                key={u._id}
                className="flex flex-col sm:flex-row justify-between sm:items-center p-3 border rounded-md gap-2"
              >
                <div>
                  <p className="font-semibold">
                    {u.name || "N/A"} ({u.email})
                  </p>
                  <p
                    className={`text-sm font-medium capitalize ${
                      u.status === "pending"
                        ? "text-yellow-500"
                        : u.status === "approved"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    Status: {u.status}
                  </p>
                </div>
                {u.status === "pending" && (
                  <div className="flex-shrink-0 space-x-2">
                    <button
                      onClick={() => handleUpdateStatus(u._id, "approved")}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(u._id, "rejected")}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No users are awaiting moderation.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          All Uploaded Datasets ({datasets.length})
        </h2>
        <div className="space-y-4">
          {datasets.length > 0 ? (
            datasets.map((d) => (
              <div key={d._id} className="p-4 border rounded-md bg-gray-50">
                <h3 className="font-bold text-lg text-indigo-700">{d.title}</h3>
                <p className="text-sm text-gray-600">
                  Uploaded by: <strong>{d.uploaderId?.name || "N/A"}</strong> on{" "}
                  {new Date(d.createdAt).toLocaleDateString()}
                </p>
                <a
                  href={`http://localhost:5000${d.fileLocation}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline mt-2 inline-block font-medium"
                >
                  View File
                </a>
              </div>
            ))
          ) : (
            <p>No datasets have been uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
