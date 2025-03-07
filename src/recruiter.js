import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ApplicantForm from "./components/ApplicantForm";
import HRDashboard from "./components/HRdashboard";
import HRFinalDecision from "./components/HRFinalDecision";
import InterviewerFeedback from "./components/InterviewerFeedback";

import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider
} from "@mui/material";

const Application = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { text: "Applicant Form", path: "/" },
    { text: "HR Dashboard", path: "/hr-dashboard" },
    { text: "Interviewer Feedback", path: "/interviewer-feedback" },
    { text: "HR Final Decision", path: "/hr-final-decision" }
  ];
  const Tittle = () => {
    return <h1>Recruitment Board </h1>;
  };

  return (
    <Router>
      {/* AppBar for Navigation */}
      <Tittle />
      <AppBar position="static">
        <Toolbar>
          {/* Mobile Menu Icon */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Title Centered */}

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navLinks.map(nav =>
              <Link
                key={nav.text}
                to={nav.path}
                style={{
                  color: "white",
                  textDecoration: "none",
                  margin: "0 15px",
                  fontSize: "16px"
                }}
              >
                {nav.text}
              </Link>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer for Mobile Navigation */}
      <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }}>
          <Divider />
          <List>
            {navLinks.map(nav =>
              <ListItem
                button
                key={nav.text}
                onClick={toggleDrawer}
                component={Link}
                to={nav.path}
              >
                <ListItemText primary={nav.text} />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<ApplicantForm />} />
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/interviewer-feedback" element={<InterviewerFeedback />} />
        <Route path="/hr-final-decision" element={<HRFinalDecision />} />
      </Routes>
    </Router>
  );
};

export default Application;
