import React, { useState } from "react";
import { Topic } from "../../shared/types";
import Modal from "react-bootstrap/Modal";

interface AddTopicFormProps {
  onAdd: (topic: Topic) => void;
  category: string;
  isOpen: boolean;
  onRequestClose: () => void;
}

const AddTopicForm: React.FC<AddTopicFormProps> = ({
  onAdd,
  category,
  isOpen,
  onRequestClose,
}) => {
  const [name, setName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "" || keywords.trim() === "") {
      setError("Please provide a valid name and at least one keyword.");
    } else {
      onAdd({ id: Date.now(), category, name, keywords: keywords.split(",") });
      setName("");
      setKeywords("");
      setError("");
      onRequestClose();
    }
  };

  return (
    <Modal show={isOpen} onHide={onRequestClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Topic</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Topic Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Keywords (comma-separated)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Add Topic</button>
          <button type="button" onClick={onRequestClose}>
            Cancel
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddTopicForm;
