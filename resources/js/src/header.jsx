import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { IoIosLogOut } from "react-icons/io";

const Header = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = '/';
    };

    return (
        <nav className="navbar fixed-top navbar-light" style={{ background: '#fff', boxShadow: '0px 0px 8px #ddd' }}>
            <div className="container-fluid">
                <span className="navbar-brand fw-bold">Quiz App</span>
                <div className="d-flex align-items-center">
                    {user && (
                        <div className="dropdown">
                            <button
                                className="btn btn-light dropdown-toggle d-flex align-items-center"
                                type="button"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <FaUser className="me-2" size={18} />
                                {user.name}
                            </button>
                            {showDropdown && (
                                <ul className="dropdown-menu show position-absolute end-0 mt-2" style={{ minWidth: '150px' }}>
                                    <li>
                                        <button className="dropdown-item text-dark" onClick={handleLogout}>
                                            <span className='d-flex align-items-center justify-content-between'>Logout <IoIosLogOut /></span>
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
