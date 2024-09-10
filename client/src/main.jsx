import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Game from './pages/Game.jsx'
import Store from './pages/Store.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'


const router = createBrowserRouter([
  {path: "/", element: <App />},
  {path: "/leaderboard", element: <Leaderboard />},
  {path: "/game", element: <Game />},
  {path: '/store', element: <Store />}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <RouterProvider router={router}/>
  </StrictMode>,
)
