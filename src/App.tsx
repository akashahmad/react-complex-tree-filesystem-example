import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <button onClick={() => navigate("/rct-dnd")}>React Complex Tree</button>
      <button onClick={() => navigate("/rb-dnd")}>React Beautiful DnD</button>
      <button onClick={() => navigate("/r-dnd")}>React DnD</button>
    </div>
  );
}

export default App;
