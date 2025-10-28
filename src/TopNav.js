// src/TopNav.js
import React from "react";

function TopNav({ setInput, setNavTriggered, setNavBarName }) {
  const go = (text, name) => {
    setInput(text);
    setNavTriggered(true);
    setNavBarName(name);
  };

  return (
    <header className="hdr" role="banner">
      <div className="hdr__light">
        <nav className="hdr --light" aria-label="Sections">
          <button className="square-lg" onClick={() => go("Tell me about your achievements","achievements")}>Achievements</button>
          <button className="square-lg" onClick={() => go("Tell me about your projects","projects")}>Projects</button>
          <button className="square-lg" onClick={() => go("Tell me about your experiences","experiences")}>Experiences</button>
          <button className="square-lg" onClick={() => go("Show me your learning certifications","certificates")}>Certificates</button>
          <button className="square-lg" onClick={() => go("Tell me about your volunteering","volunteering")}>Volunteering</button>
          <button className="square-lg" onClick={() => go("Tell me your highlights","highlights")}>Highlights</button>
        </nav>
      </div>
    </header>
  );
}

export default TopNav;
