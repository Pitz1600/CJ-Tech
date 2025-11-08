import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Create.css";
import Container from "../components/Container";

const Create = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [time, setTime] = useState("");
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileURLs = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...fileURLs]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      title,
      description,
      deadline: deadline && time ? `${deadline} ${time}` : "No Deadline",
      images,
      status: "In Progress",
    };

    console.log("New Task Created:", newTask);
    // Add API call to save task here
  };

  return (
    <div className="create-page">
      <Navbar />
      <Container>
      <div className="create-container">
        <h2>Create New Task</h2>
        <form onSubmit={handleSubmit} className="create-form">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
          />

          <label>Deadline</label>
          <div className="deadline-inputs">
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <label>Image(s)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            id="fileInput"
          />
          <button
            type="button"
            className="upload-btn"
            onClick={() => document.getElementById("fileInput").click()}
          >
            Upload an Image
          </button>

          <div className="image-preview-container">
            {images.length > 0 ? (
              images.map((img, i) => (
                <div key={i} className="image-preview">
                  <img src={img} alt={`upload-${i}`} />
                </div>
              ))
            ) : (
              <>
                <div className="sample-box">Sample images</div>
                <div className="sample-box">Sample images</div>
                <div className="sample-box">Sample images</div>
              </>
            )}
          </div>

          <button type="submit" className="save-btn">
            Save
          </button>
        </form>
      </div>
      </Container>
    </div>
  );
};

export default Create;