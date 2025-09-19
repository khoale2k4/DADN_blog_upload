import { useState, useEffect } from "react";
import SimpleTextEditor from "../components/Editor";
import { useParams } from "react-router-dom";
import downloadHtml from "../utils/downloadFile";

export default function Post() {
    const { id } = useParams();
    const [data, setData] = useState("");

    useEffect(() => {
        const fetchHtml = async () => {
            const res = await downloadHtml(id);
            setData(res);
        };
        fetchHtml();
    }, [id]);

    return (
        <div className="w-1/2">
            <SimpleTextEditor initData={data} setData={setData} editable={false} />
        </div>
    );
}
