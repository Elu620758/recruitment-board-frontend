
import React, { useState, useEffect } from "react";
import { Button, Container } from "@mui/material";
import axios from "axios";

const HRFinalDecision = () => {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    axios
      .get("https://recruitment-board-backend.onrender.com/applicants")
      .then(res => {
        console.log("Fetched Applicants:", res.data); // Log fetched data
        setApplicants(res.data.filter(app => app.status !== "Pending"));
      })
      .catch(error => console.error("Error fetching applicants:", error));
  }, []);

  const handleFinalDecision = async (applicantId, decision) => {
    try {
      await axios.put(
        `https://recruitment-board-backend.onrender.com/applicants/${applicantId}/final-decision`,
        { status: decision }
      );
      setApplicants(prev =>
        prev.map(
          app => (app._id === applicantId ? { ...app, status: decision } : app)
        )
      );
    } catch (error) {
      console.error("Error updating decision:", error);
    }
  };

  return (
    <Container>
      <h2>HR Final Decision</h2>
      {applicants.map(app =>
        <div
          key={app._id}
          style={{
            marginBottom: "15px",
            padding: "10px",
            border: "1px solid #ccc"
          }}
        >
          <h3>
            {app.name}
          </h3>
          <p>
            Status: <strong>{app.status}</strong>
          </p>
          <p>
            Interviewer Decision:
            <strong
              style={{
                color:
                  app.decision === "Recommend"
                    ? "green"
                    : app.decision === "Not Recommend" ? "red" : "gray"
              }}
            >
              {app.decision ? app.decision : "No Feedback"}
            </strong>
          </p>
          <Button
            onClick={() => handleFinalDecision(app._id, "Hired")}
            color="primary"
            variant="contained"
            disabled={app.decision === "Not Recommend"} // Disable if not recommended
          >
            Hire
          </Button>
          <Button
            onClick={() => handleFinalDecision(app._id, "Rejected")}
            color="secondary"
            variant="contained"
          >
            Not Hire
          </Button>
        </div>
      )}
    </Container>
  );
};

export default HRFinalDecision;
