import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Container,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

const InterviewerFeedback = () => {
  const [applicants, setApplicants] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get("https://recruitment-board-backend.onrender.com/applicants");
        setApplicants(res.data.filter((app) => app.status === "Interview Scheduled"));
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, []);

  const handleFeedbackSubmit = async (applicantId) => {
    const feedbackData = feedback[applicantId];
    if (!feedbackData || !feedbackData.decision) {
      alert("Please select a decision before submitting.");
      return;
    }

    try {
      await axios.put(`https://recruitment-board-backend.onrender.com/applicants/${applicantId}/feedback`, {
        decision: feedbackData.decision,
        feedbackTime: new Date().toISOString(),
      });

      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const handleOpenProfile = (applicant) => {
    setSelectedApplicant(applicant);
    setOpenProfileDialog(true);
  };

  return (
    <Container>
      <h2>Interviewer Feedback</h2>
      {applicants.map((app) => (
        <div key={app._id} style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
          <h3 style={{ cursor: "pointer", color: "blue" }} onClick={() => handleOpenProfile(app)}>
            {app.name}
          </h3>
          <p>Status: {app.status}</p>
          <p>Interviewers: {app.interviewers.join(", ")}</p>
          <p>
            Scheduled Time:{" "}
            <strong>{app.time ? new Date(app.time).toLocaleString() : "Not Available"}</strong>
          </p>
          <TextField
            label="Strengths"
            fullWidth
            onChange={(e) =>
              setFeedback({ ...feedback, [app._id]: { ...feedback[app._id], strengths: e.target.value } })
            }
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Weaknesses"
            fullWidth
            onChange={(e) =>
              setFeedback({ ...feedback, [app._id]: { ...feedback[app._id], weaknesses: e.target.value } })
            }
            style={{ marginBottom: "10px" }}
          />
          <Select
            fullWidth
            value={feedback[app._id]?.rating || ""}
            onChange={(e) =>
              setFeedback({ ...feedback, [app._id]: { ...feedback[app._id], rating: e.target.value } })
            }
            displayEmpty
            style={{ marginBottom: "10px" }}
          >
            <MenuItem value="">Select Rating (1-5)</MenuItem>
            {[1, 2, 3, 4, 5].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
          <Select
            fullWidth
            value={feedback[app._id]?.decision || ""}
            onChange={(e) =>
              setFeedback({ ...feedback, [app._id]: { ...feedback[app._id], decision: e.target.value } })
            }
            displayEmpty
            style={{ marginBottom: "10px" }}
          >
            <MenuItem value="">Select Decision</MenuItem>
            <MenuItem value="Recommend">Recommend</MenuItem>
            <MenuItem value="Not Recommend">Not Recommend</MenuItem>
          </Select>
          <Button variant="contained" color="primary" onClick={() => handleFeedbackSubmit(app._id)}>
            Submit Feedback
          </Button>
        </div>
      ))}

      {/* Candidate Profile Dialog */}
      {selectedApplicant && (
        <Dialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)} fullWidth>
          <DialogTitle>Profile: {selectedApplicant.name}</DialogTitle>
          <DialogContent>
            <Typography>Email: {selectedApplicant.email}</Typography>
            <Typography>Status: {selectedApplicant.status}</Typography>
            <Typography>Interviewers: {selectedApplicant.interviewers.join(", ")}</Typography>
            <Typography>
              Scheduled Time:{" "}
              <strong>
                {selectedApplicant.time ? new Date(selectedApplicant.time).toLocaleString() : "Not Available"}
              </strong>
            </Typography>
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

export default InterviewerFeedback;