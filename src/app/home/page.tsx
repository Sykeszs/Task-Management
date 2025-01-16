import Calendar from "./components/calendar";
import NotesPage from "./components/notes";
import ProgressPage from "./components/progress";
import Quote from "./components/quote";
import TaskManagementPage from "./components/taskmanagement";

const Home = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen overflow-auto">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Home Page</h1>

      {/* Task Management Page at the top */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <TaskManagementPage />
        <ProgressPage />
      </div>

      {/* The three components on the bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Calendar />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Quote />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <NotesPage />
        </div>
      </div>
    </div>
  );
};

export default Home;
