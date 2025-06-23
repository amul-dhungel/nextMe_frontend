// TopNav.js
import React from 'react';

function TopNav({ setInput, setNavTriggered ,setNavBarName}) {
    const handleClick = (text,navbar_name) => {
        setInput(text);  // Set the input text based on the navbar item clicked
        setNavTriggered(true);
        setNavBarName(navbar_name)
          // Trigger the sendMessage functionality in ChatComponent
    };

    return (
        <nav className="top-nav">
            <ul>
                <li><button className="nav-button" onClick={() => handleClick('Tell me about your achievements','achievements')}>Achievements</button></li>
                <li><button className="nav-button" onClick={() => handleClick('Tell me about your projects', 'projects')}>Projects</button></li>
                <li><button className="nav-button" onClick={() => handleClick('Tell me about your experiences', 'experiences')}>Experiences</button></li>
                <li><button className="nav-button" onClick={() => handleClick('Tell me about your volunteering','volunteering')}>Volunteering</button></li>
                <li><button className="nav-button" onClick={() => handleClick('Tell me about your highlights','highlights')}>Highlights</button></li>
            </ul>
        </nav>
    );
}

export default TopNav;
