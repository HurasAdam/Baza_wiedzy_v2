import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const Editor = ({style, className,onChange, ...field  }) => {

    const handleEditorChange = (content, delta, source, editor) => {
        // Usuwamy pustą treść, jeśli jest
        if (content === "<p><br></p>") {
          onChange('');
        } else {
          onChange(content);
        }
      };


  return (
   <ReactQuill 
   onChange={handleEditorChange}
   style={{
    ...style,
   
    width: '100%'  // Zapewnia, że edytor zajmuje całą szerokość rodzica (modalu)
  }}
   className={`ql-container ${className}`}  // Dodajemy klasy dla kontenera
   theme='snow' {...field}/>
  )
}

export default Editor