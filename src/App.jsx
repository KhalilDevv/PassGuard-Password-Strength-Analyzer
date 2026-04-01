import { useState, useEffect, useCallback } from 'react'
import zxcvbn from 'zxcvbn'
import PasswordInput from './components/PasswordInput'
import StrengthBar from './components/StrengthBar'
import Feedback from './components/Feedback'


const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
const CHARSET_LOWER = 'abcdefghijklmnopqrstuvwxyz'
const CHARSET_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const CHARSET_DIGIT = '0123456789'
const CHARSET_SPECIAL = '!@#$%^&*()_+-='

function generatePassword(length = 20) {
  const crypto = window.crypto || window.msCrypto
  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)


  const pick = (charset) => charset[arr[Math.floor(Math.random() * arr.length)] % charset.length]
  const mandatory = [pick(CHARSET_LOWER), pick(CHARSET_UPPER), pick(CHARSET_DIGIT), pick(CHARSET_SPECIAL)]

  const rest = Array.from({ length: length - mandatory.length }, (_, i) =>
    CHARSET[arr[i] % CHARSET.length]
  )

  const combined = [...mandatory, ...rest]
  for (let i = combined.length - 1; i > 0; i--) {
    const j = arr[i] % (i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]]
  }

  return combined.join('')
}

function estimateEntropy(password) {
  if (!password) return 0
  let charsetSize = 0
  if (/[a-z]/.test(password)) charsetSize += 26
  if (/[A-Z]/.test(password)) charsetSize += 26
  if (/[0-9]/.test(password)) charsetSize += 10
  if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32
  if (charsetSize === 0) return 0
  return password.length * Math.log2(charsetSize)
}

export default function App() {
  const [password, setPassword] = useState('')
  const [result, setResult] = useState(null)
  const [entropy, setEntropy] = useState(0)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('passguard-dark-mode')
      return saved !== null ? JSON.parse(saved) : true
    } catch { return true }
  })

  useEffect(() => {
    localStorage.setItem('passguard-dark-mode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    if (password.trim()) {
      const analysis = zxcvbn(password)
      setResult(analysis)
      setEntropy(estimateEntropy(password))
    } else {
      setResult(null)
      setEntropy(0)
    }
  }, [password])


  const handleGenerate = useCallback(() => {
    setPassword(generatePassword(20))
  }, [])

  const score = result?.score ?? 0
  const hasPassword = password.length > 0

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode
        ? 'bg-zinc-950 text-zinc-100'
        : 'bg-zinc-50 text-zinc-900'
    }`}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: darkMode
            ? 'radial-gradient(circle at 20% 20%, rgba(16,185,129,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99,102,241,0.04) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 20%, rgba(16,185,129,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99,102,241,0.06) 0%, transparent 50%)',
          backgroundSize: '100% 100%',
        }}
      />


      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-xl mx-auto">

        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/15 text-emerald-600'
          }`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <span className={`font-display text-lg tracking-tight ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
            PassGuard
          </span>
        </div>


        <button
          onClick={() => setDarkMode(d => !d)}
          title="Toggle dark mode"
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
            darkMode
              ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
              : 'bg-white text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 shadow-sm border border-zinc-200'
          }`}
        >
          {darkMode ? (
           
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
           
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </header>

      
      <main className="relative z-10 px-4 pb-12 max-w-xl mx-auto">
        <div className={`rounded-2xl p-6 sm:p-8 transition-all duration-500 ${
          darkMode
            ? 'bg-zinc-900/80 border border-zinc-800 shadow-2xl shadow-black/40 backdrop-blur-sm'
            : 'bg-white border border-zinc-100 shadow-xl shadow-zinc-200/60'
        }`}>

        
          <div className="mb-8 text-center">
            <h1 className={`font-display text-3xl sm:text-4xl mb-2 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
              Password Analyzer
            </h1>
            <p className={`text-sm font-sans ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Real-time strength analysis · Crack time estimation · Actionable tips
            </p>
          </div>

        
          <div className={`h-px mb-8 ${darkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`} />

       
          <div className="mb-6">
            <PasswordInput
              value={password}
              onChange={setPassword}
              onGenerate={handleGenerate}
              darkMode={darkMode}
            />
          </div>

       
          <div className="mb-6">
            <StrengthBar
              score={score}
              hasPassword={hasPassword}
              entropy={entropy}
              darkMode={darkMode}
            />
          </div>

         
          {hasPassword && (
            <div className={`h-px mb-6 ${darkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
          )}


          <Feedback
            result={result}
            password={password}
            darkMode={darkMode}
          />

        
          {!hasPassword && (
            <div className={`mt-4 text-center py-6 rounded-xl border-2 border-dashed ${
              darkMode ? 'border-zinc-800 text-zinc-600' : 'border-zinc-200 text-zinc-400'
            }`}>
              <div className="text-3xl mb-2">🔐</div>
              <p className="text-xs font-sans">Start typing to analyze your password</p>
            </div>
          )}
        </div>

   
        <p className={`text-center text-xs mt-6 font-mono ${darkMode ? 'text-zinc-700' : 'text-zinc-400'}`}>
          Passwords are analyzed locally · Nothing is ever sent to a server
        </p>
      </main>
    </div>
  )
}
