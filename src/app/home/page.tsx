// pages/index.tsx
import Calendar from "./components/calendar";
import TaskManagementPage from "./components/taskmanagement";

const Home = () => {
    return (
      <div>
        <h1>Home Page</h1>
        <TaskManagementPage />
        <Calendar />
      </div>
    );
  };
  
  export default Home;
  