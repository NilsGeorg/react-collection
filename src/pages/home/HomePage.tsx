import { AvailableRoutes } from "../../App"

export default function IndexPage() {
    return <div>
        <h1>Welcome to the party</h1>
        {AvailableRoutes.filter((path => path)).map( (path) => <>
            <a href={"/" + path}>{"> " + path.charAt(0).toUpperCase() + path.substring(1) }</a><br />
        </>
            
        )}
    </div>
}