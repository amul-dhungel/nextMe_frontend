import React from 'react';
import './styles.css'; // Importing the CSS file for styling
import { FaLinkedin, FaGithub } from 'react-icons/fa'; // For LinkedIn and GitHub icons

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="logo">LLM Factory</div>
            <ul className="menu">
                <li><a href="#">Configure Model</a></li>
                <li><a href="#">Voice Streams</a></li>
                <li><a href="#">Game AI</a></li>
                <li><a href="#">Dreamscape</a></li>
            </ul>

            <div className="bottom-section">
                {/* Resume download button */}
                <div className="resume-download">
                    <a href="/Resume.docx" download className="btn btn-resume">
                        Download Resume
                    </a>
                </div>

                {/* Social media links with icons */}
                <div className="social-links">
                    <a href="https://www.linkedin.com/in/amul-dhungel-0641161b1/" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
                        <FaLinkedin />
                    </a>
                    <a href="https://github.com/amul-dhungel" target="_blank" rel="noopener noreferrer" className="social-icon github">
                        <FaGithub />
                    </a>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
