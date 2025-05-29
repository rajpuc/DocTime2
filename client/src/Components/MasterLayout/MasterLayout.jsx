import React, { Fragment, useRef } from "react";
import { Container, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FaUserTie, FaLaptopMedical, FaUser } from "react-icons/fa";
import { GiMedicinePills } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { PiPrescriptionFill } from "react-icons/pi";
import {
  AiOutlineCheckCircle,
  AiOutlineEdit,
  AiOutlineLogout,
  AiOutlineMenuUnfold,
  AiOutlineUser,
} from "react-icons/ai";
import { BsListNested } from "react-icons/bs";
import { RiDashboardLine } from "react-icons/ri";
import logo from "../../assets/images/icon.png";
import { getUserDetails, removeSessions } from "../../Helper/SessionHelper";

const MasterLayout = (props) => {
  const contentRef = useRef();
  const sideNavRef = useRef();
  const onLogout = () => {
    removeSessions();
  };

  const MenuBarClickHandler = () => {
    if (sideNavRef.current.classList.contains("side-nav-open")) {
      sideNavRef.current.classList.add("side-nav-close");
      sideNavRef.current.classList.remove("side-nav-open");
      contentRef.current.classList.add("content-expand");
      contentRef.current.classList.remove("content");
    } else {
      sideNavRef.current.classList.remove("side-nav-close");
      sideNavRef.current.classList.add("side-nav-open");
      contentRef.current.classList.remove("content-expand");
      contentRef.current.classList.add("content");
    }
  };

  const userDetails = getUserDetails();
  const Name = localStorage.getItem("Name");
  return (
    <Fragment>
      <Navbar className="fixed-top px-0 shadow-sm bg-success">
        <Container fluid={true}>
          <Navbar.Brand className="d-flex align-items-center">
            <a
              className="icon-nav m-0 h5 text-light"
              onClick={MenuBarClickHandler}
            >
              <AiOutlineMenuUnfold />
            </a>
            <img className="nav-logo mx-2" src={logo} alt="logo" />
          </Navbar.Brand>

          <div className="float-right h-auto d-flex">
            <div className="user-dropdown">
              <p className="text-light">{Name}</p>
              <div className="user-dropdown-content">
                <div className="mt-4 text-center">
                  <img
                    className="icon-nav-img"
                    src={userDetails?.photo}
                    alt=""
                  />
                  <h6 key={Date.now()}> {userDetails?.Name}</h6>
                  <hr className="user-dropdown-divider p-0" />
                </div>
                <NavLink to="/Profile" className="side-bar-item">
                  <AiOutlineUser className="side-bar-item-icon" />
                  <span className="side-bar-item-caption">Profile</span>
                </NavLink>
                <a onClick={onLogout} className="side-bar-item">
                  <AiOutlineLogout className="side-bar-item-icon" />
                  <span className="side-bar-item-caption">Logout</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Navbar>

      <div ref={sideNavRef} className="side-nav-open">
        {/* <NavLink
          className={(navData) =>
            navData.isActive
              ? "side-bar-item-active side-bar-item mt-2"
              : "side-bar-item mt-2"
          }
          to="/"
          end
        >
          <RiDashboardLine className="side-bar-item-icon" />
          <span className="side-bar-item-caption">Dashboard</span>
        </NavLink> */}

        <NavLink
          className={(navData) =>
            navData.isActive
              ? "side-bar-item-active side-bar-item mt-2"
              : "side-bar-item mt-2"
          }
          to="/CreatePatient"
        >
          <FaUser className="side-bar-item-icon" />
          <span className="side-bar-item-caption">CreatePatient</span>
        </NavLink>

        <NavLink
          className={(navData) =>
            navData.isActive
              ? "side-bar-item-active side-bar-item mt-2"
              : "side-bar-item mt-2"
          }
          to="/createPrescription"
          end
        >
          <PiPrescriptionFill className="side-bar-item-icon" />
          <span className="side-bar-item-caption">Create Prescription</span>
        </NavLink>

        <NavLink
          className={(navData) =>
            navData.isActive
              ? "side-bar-item-active side-bar-item mt-2"
              : "side-bar-item mt-2"
          }
          to="/PrescriptionList"
        >
          <BsListNested className="side-bar-item-icon" />
          <span className="side-bar-item-caption">Prescription List</span>
        </NavLink>

        <NavLink
          className={(navData) =>
            navData.isActive
              ? "side-bar-item-active side-bar-item mt-2"
              : "side-bar-item mt-2"
          }
          to="/CreateMedicine"
        >
          <GiMedicinePills className="side-bar-item-icon" />
          <span className="side-bar-item-caption">Create Medicine</span>
        </NavLink>


      </div>

      <div ref={contentRef} className="content">
        {props.children}
      </div>
    </Fragment>
  );
};

export default MasterLayout;
