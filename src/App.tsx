import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <button onClick={() => navigate("/rb-dnd")}>React Complex Tree</button>
      <button onClick={() => navigate("/rt-dnd")}>React Beautiful DnD</button>
    </div>
  );
}

export default App;
