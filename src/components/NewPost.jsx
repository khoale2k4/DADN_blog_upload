import { useState } from "react";
import SimpleTextEditor from "./Editor";
import { uploadFile } from "../utils/uploadFile";
import getIDFromDownloadLink from "../utils/getLinkFromUploadedFile";

export default function NewPost() {
    const [data, setData] = useState(null);

    const handleSave = async () => {
        try {
            const blob = new Blob([data], { type: "text/html" });
            const file = new File([blob], "document.html", { type: "text/html" });
            const res = await uploadFile(file);

            console.log("Upload thành công:", res);
            alert("ID post mới: " + getIDFromDownloadLink(res));
        } catch (err) {
            console.error("Lỗi khi upload:", err);
        }
    };

    return (
        <div className="w-1/2">
            <div className="pb-10">
                <SimpleTextEditor initData={data} setData={setData} />
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="mt-3 px-6 py-2 bg-blue-100 font-medium rounded-lg shadow-md 
             hover:bg-blue-200 hover:shadow-lg 
             active:scale-95 transition-all duration-200"
                    >
                        Lưu lại
                    </button>
                </div>
            </div>
        </div>
    );
}