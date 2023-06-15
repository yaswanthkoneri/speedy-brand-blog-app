import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { Topics } from "../../shared/types";
import BlogEditor from "../BlogEditor";
import { Col, Row } from "react-bootstrap";
import { Button } from "react-bootstrap";
import styles from "./index.module.scss";

interface Category {
  name: string;
  label: string;
}

interface TopicListProps {
  topics: Topics;
  onDelete: (id: number) => void;
  onSelectCategory: (category: string | null) => void;
}

const TopicList: React.FC<TopicListProps> = ({
  topics,
  onDelete,
  onSelectCategory,
}) => {
  const categories: Category[] = [
    { name: "all", label: "All" },
    { name: "custom", label: "Custom" },
    { name: "icp", label: "ICP" },
    { name: "mission", label: "Mission" },
    { name: "product", label: "Product" },
  ];

  const renderTabs = () => {
    return categories.map((category) => {
      const categoryTopics = topics[category.name] || [];
      return (
        <Tab
          eventKey={category.name}
          title={category.label}
          key={category.name}
        >
          {categoryTopics.map((topic, i) => (
            <Row
              key={topic.id}
              className={`${styles["topic"]} align-items-center ${
                i === categoryTopics.length - 1 && "mb-3"
              } justify-content-between p-3 `}
            >
              <Col>
                <h4>{topic.name}</h4>
                <p>Keywords: {topic.keywords.join(", ")}</p>
              </Col>
              <Col className="d-flex justify-content-end">
                <BlogEditor />
                <Button className="mx-4" onClick={() => onDelete(topic.id)}>
                  Delete
                </Button>
              </Col>
            </Row>
          ))}
        </Tab>
      );
    });
  };

  return (
    <Tabs
      defaultActiveKey="all"
      id="topic-tabs"
      className="mb-3"
      onSelect={onSelectCategory}
    >
      {renderTabs()}
    </Tabs>
  );
};

export default TopicList;
