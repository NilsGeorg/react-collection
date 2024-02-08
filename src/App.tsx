import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import './App.css'
import { FunctionComponent } from 'react';
import IndexPage from './pages/home/HomePage';

type RouteElement = {url: string, element: FunctionComponent}
const pages = import.meta.glob<{default: FunctionComponent}>('./pages/**/*Page.tsx', {eager: true})

const routes: RouteElement[] = []
for (const path of Object.keys(pages)) {
  const urlFragment = path.split("/")[2]
  const reactElement = pages[path].default

  routes.push({
    url: urlFragment,
    element: reactElement,
  })
}

routes.push({
  url: "",
  element: IndexPage
})

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {routes.map((route) => {
        return <Route key={route.url} path={route.url} element={<route.element />} />
      })}
    </Route>
  )
);


function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
export const AvailableRoutes: string[] = routes.map((val) => val.url)