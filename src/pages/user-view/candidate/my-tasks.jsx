import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Dùng để điều hướng đến trang chi tiết

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      {tasks.length === 0 ? (
        <div className="text-gray-500">No tasks assigned to you yet.</div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
            >
                <div className="flex items-center">
                <img src={task?.employerId?.avatar?.url} className="w-6 h-6 rounded mr-2" />
                <h2 className="text-xl font-semibold">{task.title} - {task?.jobId?.title}</h2>
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
                  onClick={() => navigate(`/candidate/task/${task._id}`)} // Điều hướng sang trang chi tiết
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
