import React from "react";
import {Link} from "react-router-dom";

const Navbar: React.FC = () => {
    return (
        <div className={"navbar"}>
            <nav>
                <Link to="overview">Overview</Link> |
                <Link to="settings">Settings</Link> |
                <Link to="profile">Profile</Link>
            </nav>
            <hr/>
        </div>
    )
}

export default Navbar;