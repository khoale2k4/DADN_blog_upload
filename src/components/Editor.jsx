import { useRef, useEffect } from "react";
import {
    Bold, Italic, Underline, List, Image as ImageIcon, Trash2
} from "lucide-react";
import { uploadFile } from "../utils/uploadFile";

const ToolbarButton = ({ onClick, children }) => (
    <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        className="p-2 rounded-md hover:bg-gray-200 text-gray-700 transition-colors"
    >
        {children}
    </button>
);

export default function SimpleTextEditor({
    initData = "",
    setData,
    editable = true,
}) {
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && initData !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = initData;
        }
    }, [initData]);


    const handleInput = () => {
        if (setData && editorRef.current) {
            console.log(editorRef.current.innerHTML);
            setData(editorRef.current.innerHTML);
        }
    };

    const execCmd = (cmd) => {
        document.execCommand(cmd, false, null);
        editorRef.current?.focus();
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files || []);
        for (const file of files) {
            if (!file.type.startsWith("image/")) continue;

            const tempImg = insertTempImage();

            try {
                const url = await uploadFile(file);
                tempImg.src = url;
                tempImg.alt = file.name;
                tempImg.className = "max-w-full h-auto rounded-lg my-2";
                handleInput();
            } catch (err) {
                console.error("Upload error:", err);
                tempImg.alt = "Upload failed";
                tempImg.style.opacity = "0.5";
            }
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };


    const handlePaste = async (e) => {
        const items = e.clipboardData?.items || [];
        for (const item of items) {
            if (item.type.startsWith("image/")) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file) {
                    const tempImg = insertTempImage();
                    try {
                        const url = await uploadFile(file);
                        tempImg.src = url;
                        tempImg.alt = file.name;
                        tempImg.className = "max-w-full h-auto rounded-lg my-2";
                        handleInput();
                    } catch (err) {
                        console.error("Upload error:", err);
                        tempImg.alt = "Upload failed";
                        tempImg.style.opacity = "0.5";
                    }
                }
            }
        }
    };

    const insertTempImage = () => {
        const img = document.createElement("img");
        img.src = "/src/assets/loading.gif";
        img.alt = "loading...";
        img.className = "max-w-[100px] max-h-[15vh] rounded-lg my-2 opacity-70";

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            editorRef.current?.appendChild(img);
        } else {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(img);
            range.setStartAfter(img);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }

        handleInput();
        return img;
    };


    const handleClear = () => {
        if (window.confirm("Bạn có chắc muốn xóa toàn bộ nội dung?")) {
            if (editorRef.current) editorRef.current.innerHTML = "";
            handleInput();
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto border rounded-lg overflow-hidden shadow-sm">
            {editable && <div className="flex items-center gap-1 p-2 border-b bg-gray-50 flex-wrap">
                <ToolbarButton onClick={() => execCmd("bold")}>
                    <Bold size={18} />
                </ToolbarButton>
                <ToolbarButton onClick={() => execCmd("italic")}>
                    <Italic size={18} />
                </ToolbarButton>
                <ToolbarButton onClick={() => execCmd("underline")}>
                    <Underline size={18} />
                </ToolbarButton>
                <ToolbarButton onClick={() => execCmd("insertUnorderedList")}>
                    <List size={18} />
                </ToolbarButton>

                <div className="w-[1px] h-6 bg-gray-300 mx-2"></div>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <ToolbarButton onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon size={18} />
                </ToolbarButton>

                <div className="w-[1px] h-6 bg-gray-300 mx-2"></div>

                <ToolbarButton onClick={handleClear}>
                    <Trash2 size={18} />
                </ToolbarButton>
            </div>}

            <div
                ref={editorRef}
                className="min-h-[300px] max-h-[75vh] overflow-y-auto p-4 focus:outline-none prose max-w-none"
                contentEditable={editable}
                spellCheck={true}
                onInput={handleInput}
                onPaste={handlePaste}
                data-placeholder="Bắt đầu nhập nội dung của bạn ở đây..."
            />
        </div>
    );
}