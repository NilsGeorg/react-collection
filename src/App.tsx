import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import Memory from './pages/memory/Memory'
import ErrorPage from './pages/ErrorPage'


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />
  },
  {
    path: "memory",
    element: <Memory />,
    errorElement: <ErrorPage />
  }
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
