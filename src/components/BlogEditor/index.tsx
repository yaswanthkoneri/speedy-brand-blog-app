import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import {
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  DraftHandleValue,
  AtomicBlockUtils,
} from "draft-js";
import Editor from "draft-js-plugins-editor";
import createToolbarPlugin from "@draft-js-plugins/static-toolbar";
import "draft-js-static-toolbar-plugin/lib/plugin.css";
import { stateToHTML } from "draft-js-export-html";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import createImagePlugin from "draft-js-image-plugin";
import styles from "./index.module.scss";

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;

const BlogEditor = () => {
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [isImageEditorOpen, setImageEditorOpen] = useState(false);
  const [selectedTone, setSelectedTone] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const [crop, setCrop] = useState<Crop>({
    x: 0,
    y: 0,
    width: 100,
    height: 100 / (16 / 9),
  } as Crop);

  const imagePlugin = createImagePlugin();
  const plugins = [imagePlugin];

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
  };

  const handleKeyCommand = (
    command: string,
    state: EditorState
  ): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      handleEditorChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleGenerateBlog = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    const contentStateFromRaw = convertFromRaw(rawContent);
    const convertedHTML = stateToHTML(contentStateFromRaw);
    console.log(convertedHTML);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropChange = (crop: Crop) => {
    setCrop(crop);
  };

  const editorButtons = (
    <>
      <Toolbar>
        {() => (
          <>
            <Button
              variant="light"
              onClick={() =>
                handleEditorChange(
                  RichUtils.toggleInlineStyle(editorState, "BOLD")
                )
              }
            >
              B
            </Button>
            <Button
              variant="light"
              onClick={() =>
                handleEditorChange(
                  RichUtils.toggleInlineStyle(editorState, "ITALIC")
                )
              }
            >
              I
            </Button>
            <Button
              variant="light"
              onClick={() =>
                handleEditorChange(
                  RichUtils.toggleInlineStyle(editorState, "UNDERLINE")
                )
              }
            >
              U
            </Button>
            <Button
              variant="light"
              onClick={() =>
                handleEditorChange(
                  RichUtils.toggleBlockType(editorState, "unordered-list-item")
                )
              }
            >
              UL
            </Button>
            <Button
              variant="light"
              onClick={() =>
                handleEditorChange(
                  RichUtils.toggleBlockType(editorState, "ordered-list-item")
                )
              }
            >
              OL
            </Button>
            <Button variant="light" onClick={() => setImageEditorOpen(true)}>
              Add Image
            </Button>
          </>
        )}
      </Toolbar>
      <Button onClick={handleGenerateBlog}>Generate Blog</Button>
    </>
  );
  const handleImageEdit = () => {
    if (selectedImage && crop) {
      const image = new Image();
      image.src = selectedImage.toString();
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );
        const croppedImageBase64 = canvas.toDataURL("image/jpeg");
        setEditorState((prevEditorState) =>
          insertImage(prevEditorState, croppedImageBase64)
        );
      }
      setImageEditorOpen(false);
    }
  };

  const insertImage = (
    editorState: EditorState,
    base64: string | ArrayBuffer
  ) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "image",
      "IMMUTABLE",
      { src: base64 }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
  };

  return (
    <>
      <Button onClick={() => setEditorOpen(true)}>Write Topic</Button>
      <Modal
        show={isEditorOpen}
        // className={`${styles["modal"]}`}
        onHide={() => setEditorOpen(false)}
        dialogClassName={`${styles["modal"]}`}
      >
        <Modal.Header closeButton>
          <Modal.Title>Blog Editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="select"
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
          >
            <option value="">Select Tone</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
          </Form.Control>
          <div className={`${styles["editor-container"]} p-4 m-3`}>
            <Editor
              editorState={editorState}
              onChange={handleEditorChange}
              handleKeyCommand={handleKeyCommand}
              plugins={plugins}
              spellCheck={true}
            />
          </div>
          {editorButtons}
        </Modal.Body>
      </Modal>
      <Modal show={isImageEditorOpen} onHide={() => setImageEditorOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Image Editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control type="file" onChange={handleImageUpload} />
          {selectedImage && (
            <ReactCrop crop={crop} onChange={handleCropChange}>
              <img src={selectedImage as string} alt="Example" />
            </ReactCrop>
          )}
          <Button onClick={handleImageEdit}>Apply</Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BlogEditor;
