import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Dataset } from "../types";

export default function ResearcherDashboard() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [expType, setExpType] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDatasets = async () => {
    try {
      const { data } = await api.get<Dataset[]>("/datasets");
      setDatasets(data);
    } catch (error) {
      console.error("Failed to fetch datasets", error);
    }
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = searchQuery.trim()
        ? `/datasets/search?q=${searchQuery}`
        : "/datasets";
      const { data } = await api.get<Dataset[]>(endpoint);
      setDatasets(data);
    } catch (error) {
      console.error("Failed to search datasets", error);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("experimentType", expType);
    formData.append("tags", tags);

    try {
      await api.post("/datasets/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTitle("");
      setAuthor("");
      setExpType("");
      setTags("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchDatasets();
    } catch (err) {
      setError("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (datasetId: string) => {
    if (window.confirm("Are you sure you want to delete this dataset?")) {
      try {
        await api.delete(`/datasets/${datasetId}`);
        fetchDatasets();
      } catch (error) {
        console.error("Failed to delete dataset", error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Upload Dataset</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="input-style"
          />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author"
            required
            className="input-style"
          />
          <input
            type="text"
            value={expType}
            onChange={(e) => setExpType(e.target.value)}
            placeholder="Experiment Type"
            required
            className="input-style"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated)"
            required
            className="input-style"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
          <h2 className="text-2xl font-bold">My Datasets</h2>
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in your data..."
              className="input-style flex-grow"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
            >
              Search
            </button>
          </form>
        </div>
        <div className="space-y-4">
          {datasets.length > 0 ? (
            datasets.map((d) => (
              <div
                key={d._id}
                className="p-4 border rounded-md bg-gray-50 relative"
              >
                <h3 className="font-bold text-lg text-indigo-700">{d.title}</h3>
                <p className="text-sm text-gray-600">
                  By {d.author} on {new Date(d.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-2">
                  {d.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <a
                  href={`http://localhost:5000${d.fileLocation}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline mt-2 inline-block font-medium"
                >
                  View File
                </a>
                <button
                  onClick={() => handleDelete(d._id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold"
                >
                  DELETE
                </button>
              </div>
            ))
          ) : (
            <p>No datasets found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
