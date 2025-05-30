import { Route, Routes, BrowserRouter } from "react-router-dom"
import { Landing } from "./pages/landing"
import { Game } from "./pages/game"

function App() {

  return (
    <div className="bg-black text-white h-screen w-screen flex items-center justify-center">
      <BrowserRouter>
        <Routes>
          <Route path="/" element = {<Landing />} />
          <Route path="/game" element = {<Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
