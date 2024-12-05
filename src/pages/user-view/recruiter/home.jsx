import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
import CandidateList from "./candidate-list";
import { handleChat } from "@/services/chat-service";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import welcomeBg from "@/assets/bg.jpg";
import BannerSlider from "@/components/user-view/candidate/banner-slider";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function RecruiterHome() {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    skills: "",
    experience: 0,
  });

  // Fetch candidates from API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/user/get-list-candidates`,
          {
            withCredentials: true,
          }
        );

        // Kiểm tra dữ liệu trả về
        if (response.data && response.data.users) {
          setCandidates(response.data.users); // Gán danh sách ứng viên
          setFilteredCandidates(response.data.users); // Gán dữ liệu lọc ban đầu
        } else {
          console.error(
            "API trả về không có 'users' hoặc không đúng định dạng:",
            response.data
          );
          setCandidates([]); // Gán giá trị rỗng nếu không có ứng viên
          setFilteredCandidates([]);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API danh sách ứng viên:", error);
        setCandidates([]); // Đảm bảo candidates không undefined trong trường hợp lỗi
      }
    };
    fetchCandidates();
  }, []);

  // Filter candidates based on search term and filters
  useEffect(() => {
    let filtered = candidates;

    // Search by name or email
    if (searchTerm) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by skills
    if (filters.skills) {
      filtered = filtered.filter((candidate) =>
        candidate.skills.some((skill) =>
          skill.toLowerCase().includes(filters.skills.toLowerCase())
        )
      );
    }

    // Filter by experience
    if (filters.experience > 0) {
      filtered = filtered.filter(
        (candidate) => candidate.experience.length >= filters.experience
      );
    }

    setFilteredCandidates(filtered);
  }, [searchTerm, filters, candidates]);

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filters change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate); // Lưu ứng viên được chọn
    setIsModalOpen(true); // Hiển thị modal
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div
        className="flex flex-col bg-blue-200 w-full p-4 bg-cover items-center bg-center"
        style={{ backgroundImage: `url(${welcomeBg})` }}
      >
        <h1 className="text-2xl text-blue-400 font-bold max-w-[80%]">
          Gudjob - Giải pháp tuyển dụng hiệu quả, kết nối nhân tài nhanh chóng.
        </h1>
        <h1 className="text-sm my-2 text-white max-w-[80%]">
          Nền tảng uy tín giúp bạn tìm kiếm, sàng lọc và kết nối với những ứng
          viên xuất sắc. Hơn 40,000 ứng viên tiềm năng mỗi ngày sẵn sàng gia
          nhập đội ngũ của bạn.
        </h1>
        <BannerSlider />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-10">
        <input
          type="text"
          placeholder="Tìm kiếm ứng viên theo tên hoặc email..."
          className="p-2 border rounded-lg w-full"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <input
          type="text"
          name="skills"
          placeholder="Lọc theo kỹ năng..."
          className="p-2 border rounded-lg w-full"
          value={filters.skills}
          onChange={handleFilterChange}
        />

        <select
          name="experience"
          className="p-2 border rounded-lg w-full"
          value={filters.experience}
          onChange={handleFilterChange}
        >
          <option value="0">Lọc theo số năm kinh nghiệm</option>
          <option value="1">1 năm trở lên</option>
          <option value="2">2 năm trở lên</option>
          <option value="3">3 năm trở lên</option>
        </select>
      </div>

      <CandidateList
        candidates={filteredCandidates || []}
        onViewDetails={(candidate) => handleViewDetails(candidate)}
        onMessageCandidate={(id) => handleChat(id, navigate)}
      />

      {isModalOpen && (
        <CandidateDetailsModal
          candidate={selectedCandidate}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {/* <main className="flex-1 bg-gray-100 p-4">
            <Outlet />
        </main>    */}
    </div>
  );
}

export default RecruiterHome;

function CandidateDetailsModal({ candidate, onClose }) {
  if (!candidate) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div className="text-center text-xl font-bold">
          Thông tin ứng viên
          <X
            className="absolute top-4 right-4 cursor-pointer text-white"
            onClick={onClose}
          />
        </div>

        <div className="space-y-4">
          <img
            src={candidate.avatar?.url || "https://via.placeholder.com/150"}
            alt={`${candidate.name}'s avatar`}
            className="w-24 h-24 rounded-full mx-auto"
          />
          <div>
            <strong>Tên:</strong> {candidate.name}
          </div>
          <div>
            <strong>Email:</strong> {candidate.email}
          </div>
          <div>
            <strong>Số điện thoại:</strong> {candidate.phone || "Chưa cập nhật"}
          </div>
          <div>
            <strong>Kỹ năng:</strong>{" "}
            {candidate.skills.join(", ") || "Chưa cập nhật"}
          </div>
          <div>
            <strong>Trạng thái:</strong> {candidate.status}
          </div>
          <div>
            <strong>Kinh nghiệm:</strong>{" "}
            {candidate.experience.length > 0
              ? candidate.experience.join(", ")
              : "Chưa cập nhật"}
          </div>
          <div>
            <strong>Trình độ học vấn:</strong>{" "}
            {candidate.education.length > 0
              ? candidate.education.join(", ")
              : "Chưa cập nhật"}
          </div>
        </div>
      </div>
    </div>
  );
}
