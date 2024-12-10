import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Briefcase, MapPin, Globe, Building2 } from "lucide-react";
import { Rating } from "@mui/material";
import ReviewsModal from "@/components/ui/reviews-modal";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const CompanyInfo = () => {
  const { recruiterId } = useParams(); // Lấy ID từ URL
  const [recruiter, setRecruiter] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [averageRating, setAverageRating] = useState(0); // Điểm đánh giá trung bình
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  // Fetch recruiter details
  const fetchRecruiterDetails = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/user/${recruiterId}`, {
        withCredentials: true,
      });
      setRecruiter(data.user);
    } catch (error) {
      console.error("Error fetching recruiter details:", error);
    }
  };

  // Fetch jobs for the recruiter
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/job/jobs-postedby/${recruiterId}`, {
        withCredentials: true,
      });
      setJobs(data.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Fetch average rating
  const fetchAverageRating = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/review/get-average-rating/${recruiterId}`);
      setAverageRating(data.averageRating);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  const onClose = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchRecruiterDetails();
      await fetchJobs();
      await fetchAverageRating();
      setLoading(false);
    };
    fetchData();
  }, [recruiterId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-medium">Loading...</div>
      </div>
    );
  }

  if (!recruiter) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-medium text-red-500">Recruiter not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Recruiter Info */}
        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
          <img
            src={recruiter.avatar?.url || "/default-avatar.png"}
            alt={recruiter.companyName}
            className="w-32 h-32 rounded-full border-2 border-gray-300"
          />
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold text-gray-800">{recruiter.companyName}</h1>
            <p className="text-gray-600 text-sm mt-2">{recruiter.industry || "No industry available"}</p>
            <div className="flex gap-4 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                {recruiter.address || "Address not provided"}
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-400" />
                <a
                  href={recruiter.website || "#"}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {recruiter.website || "No website"}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                {recruiter.numberOfEmployees || "Chưa cập nhật"}
              </div>
            </div>
            <div className="mt-4 flex flex-col items-center lg:items-start">
              <div className="flex items-center gap-2 text-yellow-500">
                <span className="text-lg font-semibold">{averageRating}</span>
                {/* Hiển thị điểm đánh giá với component Rating từ Material UI */}
                <Rating
                  name="read-only"
                  value={averageRating}
                  readOnly
                  precision={0.5}
                  size="large"
                  sx={{
                    color: "#ffd700",
                  }}
                />
                <span
                  className="text-gray-500 cursor-pointer hover:underline hover:text-blue-500"
                  onClick={() => setOpenModal(true)} // Open the modal on click
                >
                  Xem đánh giá
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Modal */}
        {openModal && <ReviewsModal recruiterId={recruiterId} onClose={onClose} />}

        {/* Job Listings */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Open Positions</h2>
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="border p-4 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-medium text-gray-800">{job.title}</h3>
                  <p className="text-gray-600 text-sm mt-2">{job.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      <Briefcase className="inline w-5 h-5 mr-1" />
                      {job.salary || "Salary not specified"}
                    </span>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => navigate(`/candidate/job/${job._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No jobs available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
