import Navbar from "../components/navbar/navbar";
import Calendar from "./components/calendar";
import NotesPage from "./components/notes";
import ProgressPage from "./components/progress";
import Quote from "./components/quote";
import TaskManagementPage from "./components/taskmanagement";

const Home = () => {
  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <Navbar />
      <div className="min-h-screen overflow-auto lg:ml-64 p-5 bg-customColor1">

        {/* Two-row layout on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          <div className="bg-white rounded-lg shadow-lg lg:col-span-6">
            <TaskManagementPage />
          </div>
          <div className="bg-white rounded-lg shadow-lg lg:col-span-4">
            <ProgressPage />
          </div>
        </div>

        {/* The three components on the bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white rounded-lg shadow-lg">
            <Calendar />
          </div>
          <div className="bg-white rounded-lg shadow-lg">
            <Quote />
          </div>
          <div className="bg-white rounded-lg shadow-lg">
            <NotesPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
