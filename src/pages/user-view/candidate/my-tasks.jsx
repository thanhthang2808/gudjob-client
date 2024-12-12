import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/task/get-tasks-by-candidate`,
          { withCredentials: true }
        );
        setTasks(response.data.tasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks
    .filter((task) =>
      task.customId ? task.customId.toString().includes(search) : false
    )
    .filter((task) => (statusFilter ? task.status === statusFilter : true))
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.deadline) - new Date(b.deadline)
        : new Date(b.deadline) - new Date(a.deadline)
    );

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by Task ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded p-2 mr-2"
          />
          <Search className="text-gray-500" />
        </div>
        <div className="flex items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded p-2 mr-2"
          >
            <option value="">All Statuses</option>
            <option value="Assigned">Assigned</option>
            <option value="Denied">Denied</option>
            <option value="In Progress">In Progress</option>
            <option value="Submitted">Submitted</option>
            <option value="Overdue">Overdue</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded p-2"
          >
            <option value="asc">Sort by Deadline: Ascending</option>
            <option value="desc">Sort by Deadline: Descending</option>
          </select>
        </div>
      </div>
      {currentTasks.length === 0 ? (
        <div className="text-gray-500">No tasks assigned to you yet.</div>
      ) : (
        <div className="grid gap-4">
          {currentTasks.map((task) => (
            <div
              key={task._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <img
                  src={task?.employerId?.avatar?.url}
                  className="w-6 h-6 rounded mr-2"
                  alt="Employer Avatar"
                />
                <h2 className="text-xl font-semibold">
                  {task.title} - {task?.jobId?.title}
                </h2>
              </div>
              <p className="text-gray-600 mt-2">{task.description}</p>
              <div className="mt-4 text-sm">
                <div>
                  <strong>Status:</strong> {task.status}
                </div>
                <div>
                  <strong>Deadline:</strong>{" "}
                  {new Date(task.deadline).toLocaleDateString()}
                </div>
                <div>
                  <strong>Payment:</strong> ${task.payment?.amount || 0} -{" "}
                  {task.payment?.status || "Pending"}
                </div>
              </div>
              <div className="mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => navigate(`/candidate/task/${task._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyTasks;