import { useState, useEffect } from "react";
import SimpleTextEditor from "./Editor";
import { useParams } from "react-router-dom";

export default function Post() {
    const { id } = useParams();
    const [data, setData] = useState("");

    useEffect(() => {
        const fetchHtml = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/files/download/${id}.html`);
                if (!res.ok) throw new Error("Không tải được file HTML");
                const html = await res.text();
                setData(html);
            } catch (err) {
                console.error("Lỗi khi tải HTML:", err);
            }
        };
        fetchHtml();
    }, [id]);

    return (
        <div>
            <SimpleTextEditor initData={data} setData={setData} editable={false} />
        </div>
    );
}
