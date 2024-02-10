import { Link } from "react-router-dom";

export default function IndexPage() {
    return <div>
        <h1>Welcome to this place</h1>
        <p>This web space is an ongoing work in progress. Feel free to take look around!</p>

        <Link to={'memory'}> To Memory Game</Link>

        
    </div>
}