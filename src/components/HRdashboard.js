
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

const HRDashboard = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [selectedInterviewers, setSelectedInterviewers] = useState([]);
  const [interviewTime, setInterviewTime] = useState("");

  useEffect(() => {
    axios.get("https://recruitment-board-backend.onrender.com/applicants").then((res) => {
      setApplicants(res.data);
      setFilteredApplicants(res.data);
    });
  }, []);

  useEffect(() => {
    let filtered = applicants.filter(
      (applicant) =>
        applicant.name?.toLowerCase().includes(search.toLowerCase()) &&
        (statusFilter ? applicant.status === statusFilter : true)
    );
    setFilteredApplicants(filtered);
  }, [search, statusFilter, applicants]);

  const handleOpenDialog = (applicant) => {
    setSelectedApplicant(applicant);
    setSelectedInterviewers([]);
    setInterviewTime("");
    setOpenDialog(true);
  };

  const handleOpenProfile = (applicant) => {
    setSelectedApplicant(applicant);
    setOpenProfileDialog(true);
  };

  const handleAssignInterviewers = async () => {
    if (!selectedInterviewers.length || !interviewTime) {
      alert("Please select at least one interviewer and set an interview time.");
      return;
    }

    const updatedApplicant = {
      ...selectedApplicant,
      status: "Interview Scheduled",
      interviewers: selectedInterviewers,
      interviewTime,
    };

    try {
      await axios.put(`https://recruitment-board-backend.onrender.com/applicants/${selectedApplicant._id}`, updatedApplicant);

      setApplicants((prev) =>
        prev.map((app) =>
          app._id === selectedApplicant._id ? updatedApplicant : app
        )
      );

      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating applicant:", error);
      alert("Failed to assign interview.");
    }
  };

  return (
    <Container>
      <h2>HR Dashboard</h2>
      <TextField
        label="Search by Name"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <Select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        displayEmpty
        fullWidth
        style={{ marginBottom: "10px" }}
      >
        <MenuItem value="">All Status</MenuItem>
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Interview Scheduled">Scheduled</MenuItem>
        <MenuItem value="Hired">Hired</MenuItem>
        <MenuItem value="Rejected">Rejected</MenuItem>
      </Select>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredApplicants.map((applicant) => (
            <TableRow key={applicant._id}>
              <TableCell>{applicant.name}</TableCell>
              <TableCell>{applicant.email}</TableCell>
              <TableCell>{applicant.status}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleOpenProfile(applicant)}
                  variant="outlined"
                  color="secondary"
                  style={{ marginRight: "5px" }}
                >
                  View Profile
                </Button>
                <Button
                  onClick={() => handleOpenDialog(applicant)}
                  variant="contained"
                  color="primary"
                >
                  Assign Interview
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Assign Interview Dialog */}
      {selectedApplicant && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
          <DialogTitle>Assign Interviewers for {selectedApplicant.name}</DialogTitle>
          <DialogContent>
            <Select
              multiple
              fullWidth
              value={selectedInterviewers}
              onChange={(e) => setSelectedInterviewers(e.target.value)}
              displayEmpty
              style={{ marginBottom: "10px" }}
            >
              <MenuItem value="" disabled>
                Select Interviewers
              </MenuItem>
              <MenuItem value="Interviewer 1">Interviewer 1</MenuItem>
              <MenuItem value="Interviewer 2">Interviewer 2</MenuItem>
              <MenuItem value="Interviewer 3">Interviewer 3</MenuItem>
            </Select>
            <TextField
              label="Interview Time"
              type="datetime-local"
              fullWidth
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAssignInterviewers} color="primary" variant="contained">
              Submit
            </Button>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Profile View Dialog */}
      {selectedApplicant && (
        <Dialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)} fullWidth>
          <DialogTitle>Profile: {selectedApplicant.name}</DialogTitle>
          <DialogContent>
            <Typography>Email: {selectedApplicant.email}</Typography>
            <Typography>Status: {selectedApplicant.status}</Typography>
            <Typography>Experience: {selectedApplicant.experience} years</Typography>
            <Typography>Skills: {selectedApplicant.skills?.join(", ")}</Typography>
            {selectedApplicant.resume && (
              <Button
                href={selectedApplicant.resume}
                download
                variant="contained"
                color="secondary"
                style={{ marginTop: "10px" }}
              >
                Download Resume
              </Button>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenProfileDialog(false)} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default HRDashboard;