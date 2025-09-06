import { Route, Routes } from "react-router-dom"
import Register from "./pages/Register"
import { useEffect, useState } from "react"

function App() {

  const [ darkMode, setDarkMode ] = useState<boolean>(true)


  useEffect(() => {
    const userTheme = localStorage.getItem('theme')

    if (userTheme === 'dark') {
      setDarkMode(true)
    } else if (userTheme === 'light') {
      setDarkMode(false)
    } else {
      const deviceTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(deviceTheme)
    }
  }, [])

  useEffect(() => {
    const html = document.documentElement
    if(darkMode) {
      html.classList.remove('text-[#333333]', 'bg-[#fbf9f9]')
      html.classList.add('dark', 'text-[#f0f0f0]', 'bg-[#111827]')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark', 'text-[#f0f0f0]', 'bg-[#111827]')
      html.classList.add('text-[#333333]', 'bg-[#fbf9f9]')
      localStorage.setItem('theme', 'light')
    }
    console.log(darkMode)
  }, [darkMode]);

  return (
    <div>
      <button onClick={() => setDarkMode(!darkMode)}>toggle</button>
      <Routes>
        <Route path="/" element='' />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App
