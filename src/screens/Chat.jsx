import { useParams } from "react-router-dom";
import BoxChat from "../components/BoxChat";

export default function Chat() {
    const params = useParams(); 

    return (
        <div className="w-[500px]">
            <BoxChat conId={params["conId"]} userId={params["userId"]} />
        </div>
    );
}
