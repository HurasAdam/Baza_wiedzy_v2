import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../index.css";
const Editor = ({ style, className, onChange, ...field }) => {
    const handleEditorChange = (content, delta, source, editor) => {
        if (content === "<p><br></p>") {
            onChange("");
        } else {
            onChange(content);
        }
    };

    const modules = {
        clipboard: {
            matchVisual: false,
        },
    };

    return (
        <ReactQuill
            onChange={handleEditorChange}
            style={{
                ...style,

                width: "100%",
            }}
            modules={modules}
            className={`ql-container ${className}`}
            theme="snow"
            {...field}
        />
    );
};

export default Editor;
