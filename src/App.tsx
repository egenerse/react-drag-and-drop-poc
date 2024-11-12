import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import "./App.css";

const App: React.FC = () => {

useEffect(()=>{
  document.body.style.overflow = "hidden";

},[])
  return (
    <div className="app">
      <Sidebar />
      <Canvas />
    </div>
  );
};

export default App;
