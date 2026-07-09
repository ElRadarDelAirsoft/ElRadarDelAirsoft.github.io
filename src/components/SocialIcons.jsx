import { InstagramIcon, TiktokIcon, YoutubeIcon, TwitchIcon } from './Icons.jsx'

const iconBtn =
  'inline-flex items-center justify-center w-8 h-8 rounded-full ' +
  'bg-slate-200/70 text-slate-700 hover:bg-neon-blue hover:text-white transition-colors ' +
  'dark:bg-base-700/60 dark:text-slate-200 dark:hover:bg-neon-blue dark:hover:text-base-950'

function toUrl(handle, platform) {
  if (!handle) return null
  if (handle.startsWith('http')) return handle
  const clean = handle.replace('@', '')
  switch (platform) {
    case 'instagram':
      return `https://instagram.com/${clean}`
    case 'tiktok':
      return `https://tiktok.com/@${clean}`
    case 'youtube':
      return `https://youtube.com/${clean.startsWith('@') ? clean : '@' + clean}`
    case 'twitch':
      return `https://twitch.tv/${clean}`
    default:
      return null
  }
}

// Fila de iconos de redes sociales, cada uno clicable y abre en pestaña nueva.
export default function SocialIcons({ instagram, tiktok, youtube, twitch }) {
  const items = [
    { platform: 'instagram', handle: instagram, Icon: InstagramIcon, label: 'Instagram' },
    { platform: 'tiktok', handle: tiktok, Icon: TiktokIcon, label: 'TikTok' },
    { platform: 'youtube', handle: youtube, Icon: YoutubeIcon, label: 'YouTube' },
    { platform: 'twitch', handle: twitch, Icon: TwitchIcon, label: 'Twitch' },
  ].filter((it) => it.handle)

  if (items.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      {items.map(({ platform, handle, Icon, label }) => (
        <a
          key={platform}
          href={toUrl(handle, platform)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={iconBtn}
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  )
}
