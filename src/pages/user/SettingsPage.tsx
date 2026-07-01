import { useState } from 'react';
import { BellOff, Globe, Moon, Sun, Shield, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { toggleDarkMode } from '../../store/slices/uiSlice';
import { addToast } from '../../store/slices/uiSlice';

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(v => !v)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${on ? 'bg-sky-500' : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${on ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(s => s.ui.darkMode);

  const handleSave = () => {
    dispatch(addToast({ message: 'Settings saved successfully!', type: 'success' }));
  };

  const sections = [
    {
      title: 'Appearance',
      icon: <Sun size={18} className="text-amber-400" />,
      items: [
        {
          label: 'Dark Mode',
          desc: 'Switch between light and dark interface',
          control: (
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${darkMode ? 'bg-sky-500' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          ),
        },
      ],
    },
    {
      title: 'Notifications',
      icon: <BellOff size={18} className="text-sky-400" />,
      items: [
        { label: 'Email Notifications', desc: 'Receive updates about your listings and messages', control: <Toggle defaultOn /> },
        { label: 'New Message Alerts', desc: 'Get notified when you receive a new message', control: <Toggle defaultOn /> },
        { label: 'Price Drop Alerts', desc: 'Alerts when saved properties drop in price', control: <Toggle /> },
        { label: 'Marketing Emails', desc: 'Property recommendations and newsletter', control: <Toggle /> },
      ],
    },
    {
      title: 'Privacy',
      icon: <Shield size={18} className="text-green-400" />,
      items: [
        { label: 'Show Profile Publicly', desc: 'Allow others to see your profile details', control: <Toggle defaultOn /> },
        { label: 'Show Phone Number', desc: 'Display your phone number on listings', control: <Toggle defaultOn /> },
        { label: 'Search Engine Indexing', desc: 'Allow search engines to index your listings', control: <Toggle defaultOn /> },
      ],
    },
    {
      title: 'Language & Region',
      icon: <Globe size={18} className="text-purple-400" />,
      items: [
        {
          label: 'Language',
          desc: 'Interface display language',
          control: (
            <select className="dh-input py-1.5 text-sm w-36">
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>Arabic</option>
            </select>
          ),
        },
        {
          label: 'Currency',
          desc: 'Default currency for property prices',
          control: (
            <select className="dh-input py-1.5 text-sm w-36">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          ),
        },
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title">Settings</h1>
        <p className="section-subtitle">Manage your account preferences and privacy</p>
      </div>

      <div className="flex flex-col gap-6">
        {sections.map(section => (
          <div key={section.title} className="dh-card overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-custom" style={{ background: 'rgb(var(--color-bg))' }}>
              {section.icon}
              <h2 className="font-bold text-custom text-sm uppercase tracking-wider">{section.title}</h2>
            </div>
            <div className="divide-y divide-custom">
              {section.items.map(item => (
                <div key={item.label} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-custom">{item.label}</p>
                    <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                  </div>
                  {item.control}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="dh-card overflow-hidden" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
          <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)' }}>
            <Trash2 size={18} className="text-red-500" />
            <h2 className="font-bold text-red-500 text-sm uppercase tracking-wider">Danger Zone</h2>
          </div>
          <div className="px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-custom">Delete Account</p>
              <p className="text-xs text-muted mt-0.5">Permanently delete your account and all data. This cannot be undone.</p>
            </div>
            <button className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold text-red-500 border border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              Delete
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} className="btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
