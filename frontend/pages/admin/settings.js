import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { updateSetting } from '../../lib/api'
import { themes } from '../../lib/themes'
import { useTheme } from '../../lib/ThemeContext'

export default function AdminSettings() {
  const [accessToken, setAccessToken] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { currentThemeId, setCurrentThemeId } = useTheme()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null
    if (!token) {
      router.push('/admin/login')
      return
    }
    setAccessToken(token)
  }, [router])

  const handleThemeChange = async (themeId) => {
    setSaving(true)
    setMessage('')
    try {
      await updateSetting('theme', { active: themeId }, accessToken)
      setCurrentThemeId(themeId)
      setMessage('Theme updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to update theme')
    } finally {
      setSaving(false)
    }
  }

  if (!accessToken) return <div className="min-h-screen p-6">Loading...</div>

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Site Settings</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Theme Selection</h2>
          <p className="text-gray-600 mb-6">Choose a theme for your school website</p>
          
          {message && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
              {message}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(themes).map(([id, theme]) => (
              <div
                key={id}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  currentThemeId === id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => !saving && handleThemeChange(id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold">{theme.name}</h3>
                  {currentThemeId === id && (
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">{theme.description}</p>
                <div className="flex gap-2">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: theme.colors.primary }}
                  ></div>
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: theme.colors.secondary }}
                  ></div>
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: theme.colors.accent }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Other Settings</h2>
          <p className="text-gray-600">Additional settings coming soon...</p>
        </div>
      </div>
    </div>
  )
}
