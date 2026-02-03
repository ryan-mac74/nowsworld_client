import { useState, useEffect } from 'react'
import reactLogo from '/react.svg'
import viteLogo from '/vite.svg'

function Home() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        return res.json()
      })
      .then(data => console.log(data))
      .catch(err => console.error("API error:", err))
  }, [])

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center gap-8">
        <div className="flex gap-4">
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>

        <div className="flex gap-16">
          <button
            className="btn btn-color"
            onClick={() => setCount1(count1 + 1)}
          >
            {count1}
          </button>

          <button
            className="btn btn-color"
            onClick={() => setCount2(count2 + 1)}
          >
            {count2}
          </button>
        </div>
      </div>
    </>
  )
}

export default Home
