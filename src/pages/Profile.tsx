import { useState } from 'react';
import { UserIcon, BellIcon, SettingsIcon, CreditCardIcon, LogOutIcon, ShieldIcon, CheckIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export function Profile() {
  const [isPremium, setIsPremium] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const settingsItems = [
    {
      icon: BellIcon,
      label: 'Notifications',
      description: 'Get notified about new content',
      action: (
        <Switch
          checked={notifications}
          onCheckedChange={setNotifications}
        />
      ),
    },
    {
      icon: ShieldIcon,
      label: 'Privacy & Security',
      description: 'Manage your privacy settings',
      action: <ChevronRight />,
    },
    {
      icon: SettingsIcon,
      label: 'General Settings',
      description: 'App preferences and more',
      action: <ChevronRight />,
    },
  ];

  return (
    <div className="min-h-screen bg-vp-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-vp-black/90 backdrop-blur-xl border-b border-vp-surface-light">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-vp-text">Profile</h1>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-4 py-6">
        {/* User Info */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vp-red to-vp-red-dark flex items-center justify-center">
            <UserIcon size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-vp-text">VoidUser</h2>
            <p className="text-sm text-vp-text-secondary">@voiduser123</p>
            <div className="flex items-center gap-2 mt-1">
              {isPremium ? (
                <span className="px-2 py-0.5 rounded-full bg-vp-red/20 text-vp-red text-xs font-medium">
                  Premium
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-vp-surface text-vp-text-secondary text-xs">
                  Free Member
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="p-4 rounded-xl bg-vp-surface text-center">
            <p className="text-2xl font-bold text-vp-text">247</p>
            <p className="text-xs text-vp-text-secondary mt-1">Videos Watched</p>
          </div>
          <div className="p-4 rounded-xl bg-vp-surface text-center">
            <p className="text-2xl font-bold text-vp-text">18</p>
            <p className="text-xs text-vp-text-secondary mt-1">Favorites</p>
          </div>
          <div className="p-4 rounded-xl bg-vp-surface text-center">
            <p className="text-2xl font-bold text-vp-text">42h</p>
            <p className="text-xs text-vp-text-secondary mt-1">Watch Time</p>
          </div>
        </div>

        {/* Upgrade Section */}
        {!isPremium && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-vp-red/20 to-vp-red/5 border border-vp-red/30 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-vp-text mb-1">
                  Go Premium
                </h3>
                <p className="text-sm text-vp-text-secondary">
                  Unlock exclusive content and features
                </p>
              </div>
            </div>
            
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm text-vp-text">
                <CheckIcon size={16} className="text-vp-green" />
                Ad-free experience
              </li>
              <li className="flex items-center gap-2 text-sm text-vp-text">
                <CheckIcon size={16} className="text-vp-green" />
                Early access to new content
              </li>
              <li className="flex items-center gap-2 text-sm text-vp-text">
                <CheckIcon size={16} className="text-vp-green" />
                Priority processing
              </li>
            </ul>

            <Button
              onClick={() => setIsPremium(true)}
              className="w-full bg-vp-red hover:bg-vp-red-dark text-white"
            >
              <CreditCardIcon size={16} className="mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        )}

        {/* Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-vp-text uppercase tracking-wide">
            Settings
          </h3>

          {settingsItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-vp-surface hover:bg-vp-surface-light transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-vp-surface-light flex items-center justify-center">
                <item.icon size={18} className="text-vp-text" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-vp-text">{item.label}</p>
                <p className="text-xs text-vp-text-secondary mt-0.5">
                  {item.description}
                </p>
              </div>
              {item.action}
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-8 pt-6 border-t border-vp-surface-light">
          <Button
            variant="outline"
            className="w-full border-vp-surface-light text-vp-text hover:bg-vp-surface hover:text-red-400"
          >
            <LogOutIcon size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChevronRight() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-vp-text-muted"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
