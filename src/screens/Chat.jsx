import { useParams } from "react-router-dom";
import BoxChat from "../components/BoxChat";

export default function Chat() {
    const params = useParams(); 

    return (
        <div className="w-[500px]">
            <BoxChat userId_1={params["userId_1"]} userId_2={params["userId_2"]} />
        </div>
    );
}
