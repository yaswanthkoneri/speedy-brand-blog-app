import React, { useState } from "react";
import TopicList from "./TopicList";
import AddTopicForm from "./AddTopicForm";
import { Topic, Topics } from "../shared/types";

const AllTopics: React.FC = () => {
  const [topics, setTopics] = useState<Topics>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleAddTopic = (topic: Topic) => {
    const category = topic.category.trim();
    const updatedTopics: Topics = {
      ...topics,
      [category]: [...(topics[category] || []), topic],
    };
    setTopics(updatedTopics);
    toggleModal();
  };

  const handleDeleteTopic = (id: number) => {
    const updatedTopics: Topics = Object.keys(topics).reduce(
      (acc: Topics, category) => {
        const filteredTopics = topics[category].filter(
          (topic) => topic.id !== id
        );
        if (filteredTopics.length) {
          acc[category] = filteredTopics;
        }
        return acc;
      },
      {}
    );
    setTopics(updatedTopics);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSelectCategory = (category: string | null) => {
    if (!category) return;
    setSelectedCategory(category);
  };

  return (
    <div className="p-5">
      <TopicList
        topics={topics}
        onDelete={handleDeleteTopic}
        onSelectCategory={handleSelectCategory}
      />
      <button onClick={toggleModal}>Open Form</button>

      {isModalOpen && (
        <AddTopicForm
          onAdd={handleAddTopic}
          category={selectedCategory}
          isOpen={isModalOpen}
          onRequestClose={toggleModal}
        />
      )}
    </div>
  );
};

export default AllTopics;
