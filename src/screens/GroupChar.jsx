import { useParams } from "react-router-dom";
import GroupBoxChat from "../components/GroupBoxChat";

export default function GroupChat() {
    const params = useParams(); 

    return (
        <div className="w-[500px]">
            <GroupBoxChat conId={params["conId"]} userId={params["userId"]} />
        </div>
    );
}