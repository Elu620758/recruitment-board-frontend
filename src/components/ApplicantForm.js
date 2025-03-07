import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Container,
  Select,
  MenuItem,
  FormHelperText
} from "@mui/material";

const ApplicantForm = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      skills: [],
      resume: null,
      experience: "",
      education: ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
        .required("Phone is required"),
      skills: Yup.array().min(1, "Select at least one skill"),
      resume: Yup.mixed().required("Resume is required"),
      experience: Yup.string().required("Experience is required"),
      education: Yup.string().required("Education is required")
    }),
    onSubmit: async values => {
      const formData = new FormData();
      Object.keys(values).forEach(key => formData.append(key, values[key]));

      try {
        await axios.post("https://recruitment-board-backend.onrender.com/applicants", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        alert("Application submitted successfully!");
        formik.resetForm();
        document.getElementById("resumeInput").value = ""; // Clear file input manually
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Submission failed!");
      }
    }
  });

  return (
    <Container>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          name="name"
          label="Name"
          fullWidth
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />

        <TextField
          name="email"
          label="Email"
          fullWidth
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <TextField
          name="phone"
          label="Phone"
          fullWidth
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
        />

        <Select
          name="skills"
          multiple
          value={formik.values.skills}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          error={formik.touched.skills && Boolean(formik.errors.skills)}
          aria-placeholder="skills"
        >
          <MenuItem value="" disabled>
            Select a Skill
          </MenuItem>
          <MenuItem value="Html">Html</MenuItem>
          <MenuItem value="Css">Css</MenuItem>
          <MenuItem value="Javascript">Javascript</MenuItem>
          <MenuItem value="React">React</MenuItem>
          <MenuItem value="Node.js">Node.js</MenuItem>
          <MenuItem value="Express">Express</MenuItem>
          <MenuItem value="MongoDB">MongoDB</MenuItem>
        </Select>
        <FormHelperText error>
          {formik.touched.skills && formik.errors.skills}
        </FormHelperText>

        <input
          type="file"
          id="resumeInput"
          onChange={event =>
            formik.setFieldValue("resume", event.currentTarget.files[0])}
          onBlur={formik.handleBlur}
        />
        {formik.touched.resume &&
          formik.errors.resume &&
          <FormHelperText error>
            {formik.errors.resume}
          </FormHelperText>}

        <TextField
          name="experience"
          label="Experience"
          fullWidth
          value={formik.values.experience}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.experience && Boolean(formik.errors.experience)}
          helperText={formik.touched.experience && formik.errors.experience}
        />

        <TextField
          name="education"
          label="Education"
          fullWidth
          value={formik.values.education}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.education && Boolean(formik.errors.education)}
          helperText={formik.touched.education && formik.errors.education}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Container>
  );
};
export default ApplicantForm;
