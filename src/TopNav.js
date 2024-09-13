// TopNav.js
import React from 'react';

function TopNav({ setInput, setNavTriggered }) {
    const handleClick = (text) => {
        setInput(text);  // Set the input text based on the navbar item clicked
        setNavTriggered(true);  // Trigger the sendMessage functionality in ChatComponent
    };

    return (
        <nav className="top-nav">
            <ul>
                <li><button className="nav-button" onClick={() => handleClick('Tell me about your achievements')}>Achievements</button></li>
                <li><button className="nav-button" onClick={() => handleClick('Tell me about your projects')}>Projects</button></li>
                <li><button className="nav-button" onClick={() => handleClick('Tell me about your experiences')}>Experiences</button></li>
                <li><button className="nav-button" onClick={() => handleClick('Tell me about your volunteering')}>Volunteering</button></li>
                <li><button className="nav-button" onClick={() => handleClick('Tell me about your highlights')}>Highlights</button></li>
            </ul>
        </nav>
    );
}

export default TopNav;
