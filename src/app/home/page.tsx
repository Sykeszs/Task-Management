// pages/index.tsx
import Calendar from "./components/calendar";
import Quote from "./components/quote";
import TaskManagementPage from "./components/taskmanagement";

const Home = () => {
    return (
      <div>
        <h1>Home Page</h1>
        <TaskManagementPage />
        <Calendar />
        <Quote />
      </div>
    );
  };
  
  export default Home;
  