import { useRouteError } from "react-router-dom";


type ErrorType = { statusText: string, message: string, status: number }
export default function ErrorPage() {
    const error = useRouteError()
    if (error) {
        console.error(error);
        return routeError(error as ErrorType)
    }


    return (<>
        <h1>Sorry something went  completely wrong :(</h1>
    </>)
}

function routeError(error: ErrorType) {
    if (error.status = 404) {
        return (<>
            <h1>Sorry, we could not find the page you are looking for :(</h1>
        </>)
    } 

    return (<>
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred. :( </p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    </>)
}
