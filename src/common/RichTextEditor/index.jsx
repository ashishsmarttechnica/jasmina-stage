"use client";
import "@/styles/RichTextEditor.css";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

// Clean icons
const MenuIcons = {
  bold: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z"
      />
    </svg>
  ),
  italic: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path fill="currentColor" d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z" />
    </svg>
  ),
  strike: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.87-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316 2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.603l-.12-.117H3v-2h18v2h-3.846zm-4.078-3H7.629a4.086 4.086 0 0 1-.481-.522C6.716 9.92 6.5 9.246 6.5 8.452c0-1.236.466-2.287 1.397-3.153C8.83 4.433 10.271 4 12.222 4c1.471 0 2.879.328 4.222.984v2.152c-1.2-.687-2.515-1.03-3.946-1.03-2.48 0-3.719.782-3.719 2.346 0 .42.218.786.654 1.099.436.313.974.562 1.613.75.62.18 1.297.414 2.03.699z"
      />
    </svg>
  ),
  underline: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M8 3v9a4 4 0 1 0 8 0V3h2v9a6 6 0 1 1-12 0V3h2zM4 20h16v2H4v-2z"
      />
    </svg>
  ),
  heading1: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0H24V24H0z" />
      <path fill="currentColor" d="M13 20h-2v-7H4v7H2V4h2v7h7V4h2z" />
    </svg>
  ),
  heading2: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M4 4v7h7V4h2v16h-2v-7H4v7H2V4h2zm14.5 4c2.071 0 3.75 1.679 3.75 3.75 0 .857-.288 1.648-.772 2.28l-.148.18L18.034 18H22v2h-7v-1.556l4.82-5.546c.268-.307.43-.709.43-1.148 0-.966-.784-1.75-1.75-1.75-.918 0-1.671.707-1.744 1.606l-.006.144h-2C14.75 9.679 16.429 8 18.5 8z"
      />
    </svg>
  ),
  heading3: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M22 8l-.002 2-2.505 2.883c1.59.435 2.757 1.89 2.757 3.617 0 2.071-1.679 3.75-3.75 3.75-1.826 0-3.347-1.305-3.682-3.033l1.964-.382c.156.806.866 1.415 1.718 1.415.966 0 1.75-.784 1.75-1.75s-.784-1.75-1.75-1.75c-.286 0-.556.069-.794.19l-1.307-1.547L19.35 10H15V8h7zM4 4v7h7V4h2v16h-2v-7H4v7H2V4h2z"
      />
    </svg>
  ),
  heading4: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16zm9-12v8h1.5v2H22v2h-2v2h-5.5v-1.34l5-8.66H22zm-2 3.133L17.19 16H20v-4.867z"
      />
    </svg>
  ),
  paragraph: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M12 6v15h-2v-5a6 6 0 1 1 0-12h10v2h-3v15h-2V6h-3zm-2 0a4 4 0 1 0 0 8V6z"
      />
    </svg>
  ),
  bulletList: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M8 4h13v2H8V4zm0 7h13v2H8v-2zm0 7h13v2H8v-2zM4 4h2v2H4V4zm0 7h2v2H4v-2zm0 7h2v2H4v-2z"
      />
    </svg>
  ),
  orderedList: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M8 4h13v2H8V4zm0 7h13v2H8v-2zm0 7h13v2H8v-2zM5 4h1v2H3V4h1V3H3V1h2v3zm-1 7v1h3v2H3v-3h2v-1H3v-2h3v3H4zm-1 7h3v4H3v-4zm2 1H4v2h1v-2z"
      />
    </svg>
  ),
  blockquote: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"
      />
    </svg>
  ),
  link: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z"
      />
    </svg>
  ),
  alignLeft: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path fill="currentColor" d="M3 4h18v2H3V4zm0 15h14v2H3v-2zm0-5h18v2H3v-2zm0-5h14v2H3V9z" />
    </svg>
  ),
  alignCenter: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path fill="currentColor" d="M3 4h18v2H3V4zm4 15h10v2H7v-2zm-4-5h18v2H3v-2zm4-5h10v2H7V9z" />
    </svg>
  ),
  alignRight: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path fill="currentColor" d="M3 4h18v2H3V4zm0 15h14v2H3v-2zm0-5h18v2H3v-2zm4-5h14v2H7V9z" />
    </svg>
  ),
  image: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M5 11.1l2-2 5.5 5.5 3.5-3.5 3 3V5H5v6.1zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm11.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
      />
    </svg>
  ),
  undo: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M5.828 7l2.536 2.536L6.95 10.95 2 6l4.95-4.95 1.414 1.414L5.828 5H13a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H5.828z"
      />
    </svg>
  ),
  redo: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M18.172 7H11a6 6 0 1 0 0 12h9v2h-9a8 8 0 1 1 0-16h7.172l-2.536-2.536L17.05 1.05 22 6l-4.95 4.95-1.414-1.414L18.172 7z"
      />
    </svg>
  ),
  code: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M16.95 8.464l1.414-1.414 4.95 4.95-4.95 4.95-1.414-1.414L20.485 12 16.95 8.464zm-9.9 0L3.515 12l3.535 3.536-1.414 1.414L.686 12l4.95-4.95L7.05 8.464z"
      />
    </svg>
  ),
};

// Component props interface
// defaultValue: Initial HTML content
// onChange: Function to call when content changes
// height: Optional height for the editor

const RichTextEditor = ({ defaultValue = "", onChange, height = "200px", className = "" }) => {
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showHtmlMode, setShowHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: "rich-blockquote",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "bullet-list",
            "data-type": "bulletList",
          },
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          HTMLAttributes: {
            class: "ordered-list",
            "data-type": "orderedList",
            style: "list-style-type: decimal",
          },
          keepMarks: true,
          keepAttributes: true,
        },
        listItem: {
          HTMLAttributes: {
            class: "list-item",
          },
        },
      }),
      Underline.configure({
        HTMLAttributes: {
          class: "rich-underline",
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: defaultValue,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlContent(html);
      if (onChange) {
        onChange(html);
      }
    },
  });

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt("Enter URL");
    if (url && editor) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  const handleHtmlChange = (e) => {
    setHtmlContent(e.target.value);
    if (editor) {
      editor.commands.setContent(e.target.value, false);
    }
    if (onChange) {
      onChange(e.target.value);
    }
  };

  if (!editor) {
    return null;
  }

  const getHeadingLabel = () => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    if (editor.isActive("heading", { level: 4 })) return "Heading 4";
    return "Paragraph";
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      <div className="editor-header">
        <div className="editor-menubar">
          <div className="heading-dropdown-container">
            <button
              onClick={() => setShowHeadingMenu(!showHeadingMenu)}
              className="heading-dropdown-button"
              title={getHeadingLabel()}
              type="button"
            >
              {getHeadingLabel()}
              <span className="dropdown-arrow">▼</span>
            </button>
            {showHeadingMenu && (
              <div className="heading-dropdown-menu">
                <button
                  onClick={() => {
                    editor.chain().focus().setParagraph().run();
                    setShowHeadingMenu(false);
                  }}
                  className={editor.isActive("paragraph") ? "is-active" : ""}
                  type="button"
                >
                  <span className="dropdown-icon">{MenuIcons.paragraph}</span>
                  <span>Paragraph</span>
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 1 }).run();
                    setShowHeadingMenu(false);
                  }}
                  className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
                  type="button"
                >
                  <span className="dropdown-icon">{MenuIcons.heading1}</span>
                  <span>Heading 1</span>
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 2 }).run();
                    setShowHeadingMenu(false);
                  }}
                  className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
                  type="button"
                >
                  <span className="dropdown-icon">{MenuIcons.heading2}</span>
                  <span>Heading 2</span>
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 3 }).run();
                    setShowHeadingMenu(false);
                  }}
                  className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
                  type="button"
                >
                  <span className="dropdown-icon">{MenuIcons.heading3}</span>
                  <span>Heading 3</span>
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 4 }).run();
                    setShowHeadingMenu(false);
                  }}
                  className={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}
                  type="button"
                >
                  <span className="dropdown-icon">{MenuIcons.heading4}</span>
                  <span>Heading 4</span>
                </button>
              </div>
            )}
          </div>

          <div className="divider"></div>

          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
            title="Bold"
            type="button"
          >
            {MenuIcons.bold}
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
            title="Italic"
            type="button"
          >
            {MenuIcons.italic}
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
            title="Strike"
            type="button"
          >
            {MenuIcons.strike}
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "is-active" : ""}
            title="Underline"
            type="button"
          >
            {MenuIcons.underline}
          </button>
          <div className="divider"></div>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
            title="Bullet List"
            type="button"
          >
            {MenuIcons.bulletList}
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleOrderedList().run();
              setTimeout(() => {
                const orderedLists = document.querySelectorAll(
                  '.ProseMirror ol[data-type="orderedList"]'
                );
                orderedLists.forEach((list) => {
                  list.style.listStyleType = "decimal";
                  const items = list.querySelectorAll("li");
                  items.forEach((item) => {
                    item.style.listStyleType = "decimal";
                    item.style.display = "list-item";
                  });
                });
              }, 50);
            }}
            className={editor.isActive("orderedList") ? "is-active" : ""}
            title="Ordered List"
            type="button"
          >
            {MenuIcons.orderedList}
          </button>
          <div className="divider"></div>

          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "is-active" : ""}
            title="Blockquote"
            type="button"
          >
            {MenuIcons.blockquote}
          </button>
          <button
            onClick={setLink}
            className={editor.isActive("link") ? "is-active" : ""}
            title="Link"
            type="button"
          >
            {MenuIcons.link}
          </button>
          <button onClick={addImage} title="Image" type="button">
            {MenuIcons.image}
          </button>
          <div className="divider"></div>

          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
            title="Align Left"
            type="button"
          >
            {MenuIcons.alignLeft}
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}
            title="Align Center"
            type="button"
          >
            {MenuIcons.alignCenter}
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
            title="Align Right"
            type="button"
          >
            {MenuIcons.alignRight}
          </button>
          <div className="divider"></div>

          <button onClick={() => editor.chain().focus().undo().run()} title="Undo" type="button">
            {MenuIcons.undo}
          </button>
          <button onClick={() => editor.chain().focus().redo().run()} title="Redo" type="button">
            {MenuIcons.redo}
          </button>
          <div className="divider"></div>

          <button
            onClick={() => setShowHtmlMode(!showHtmlMode)}
            className={showHtmlMode ? "is-active" : ""}
            title="HTML Mode"
            type="button"
          >
            {MenuIcons.code}
          </button>
        </div>
      </div>

      {showHtmlMode ? (
        <textarea
          className="html-editor"
          style={{ height }}
          value={htmlContent}
          onChange={handleHtmlChange}
        />
      ) : (
        <EditorContent editor={editor} className="editor-content" style={{ height }} />
      )}
    </div>
  );
};

export default RichTextEditor;
