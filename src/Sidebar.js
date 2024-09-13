import React from 'react';

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="logo">LLM Factory</div>
            <ul className="menu">
                <li><a href="#">New Chat</a></li>
                <li><a href="#">Configure Model</a></li>
                <li><a href="#">History</a></li>
            </ul>
        </aside>
    );
}

export default Sidebar;
