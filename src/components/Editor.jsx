import { useRef, useEffect } from "react";
import {
    Bold, Italic, Underline, List, Image as ImageIcon, Trash2, File as FileIcon
} from "lucide-react";
import { uploadFile } from "../utils/uploadFile";
import getFileIcon from "../utils/getFileIcon";

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
    const fileInputRefDoc = useRef(null);

    useEffect(() => {
        if (editorRef.current && initData !== editorRef.current.innerHTML) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(initData, "text/html");

            doc.querySelectorAll("img").forEach((img) => {
                const realSrc = img.getAttribute("src");
                if (realSrc) {
                    img.setAttribute("src", realSrc);
                    img.setAttribute(
                        "class",
                        "max-w-full h-auto rounded-lg my-2 bg-blue-100"
                    );
                }
            });

            editorRef.current.innerHTML = doc.body.innerHTML;
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

    const handleDocChange = async (e) => {
        const files = Array.from(e.target.files || []);
        for (const file of files) {
            try {
                const url = await uploadFile(file);

                const wrapper = document.createElement("div");
                wrapper.contentEditable = "false";
                wrapper.className = "my-2 relative group";

                const container = document.createElement("div");
                container.className =
                    "flex items-center gap-3 p-3 border rounded-lg bg-gray-50 shadow-sm max-w-sm";

                const icon = document.createElement("div");
                icon.className =
                    "flex-shrink-0 w-10 h-10 flex items-center justify-center rounded bg-blue-100";
                icon.innerHTML = getFileIcon(file.name);

                const link = document.createElement("a");
                link.href = url;
                link.download = file.name;
                link.innerText = file.name;
                link.className =
                    "text-blue-600 font-medium underline truncate hover:text-blue-800 max-w-[200px]";

                const removeBtn = document.createElement("button");
                removeBtn.innerHTML = "✕";
                removeBtn.className =
                    "absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition";
                removeBtn.onclick = () => {
                    wrapper.remove();
                    handleInput();
                };

                container.appendChild(icon);
                container.appendChild(link);

                wrapper.appendChild(container);
                wrapper.appendChild(removeBtn);

                insertNode(wrapper);
                handleInput();
            } catch (err) {
                console.error("Upload document error:", err);
            }
        }
        if (fileInputRefDoc.current) fileInputRefDoc.current.value = "";
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

    const insertNode = (node) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            editorRef.current?.appendChild(node);
            editorRef.current?.appendChild(document.createElement("br"));
        } else {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(node);

            const br = document.createElement("br");
            node.parentNode.insertBefore(br, node.nextSibling);

            range.setStartAfter(br);
            range.setEndAfter(br);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        handleInput();
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

                <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                    ref={fileInputRefDoc}
                    onChange={handleDocChange}
                    className="hidden"
                />
                <ToolbarButton onClick={() => fileInputRefDoc.current?.click()}>
                    <FileIcon size={18} />
                </ToolbarButton>

                <div className="w-[1px] h-6 bg-gray-300 mx-2"></div>

                <ToolbarButton onClick={handleClear}>
                    <Trash2 size={18} />
                </ToolbarButton>
            </div>}

            <div
                ref={editorRef}
                className="min-h-[300px] max-h-[75vh] overflow-y-auto p-4 focus:outline-none prose max-w-none placeholder-div"
                contentEditable={editable}
                spellCheck={true}
                onInput={handleInput}
                onPaste={handlePaste}
                data-placeholder="Bắt đầu nhập nội dung của bạn ở đây..."
                aria-placeholder="hehe"
            />
        </div>
    );
}