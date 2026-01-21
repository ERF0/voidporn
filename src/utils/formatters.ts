export function formatDuration(seconds: number): string {
  if (seconds === 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function formatViews(views: number): string {
  if (views === 0) return '0 views';
  if (views < 1000) return `${views} views`;
  if (views < 1000000) return `${(views / 1000).toFixed(1)}K views`;
  return `${(views / 1000000).toFixed(1)}M views`;
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function formatETA(minutes: number): string {
  if (minutes < 1) return 'Almost ready';
  if (minutes < 60) return `Coming in ${minutes} min${minutes > 1 ? 's' : ''}`;
  const hours = Math.floor(minutes / 60);
  return `Coming in ${hours}h ${minutes % 60}m`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'published':
    case 'completed':
      return 'text-vp-green';
    case 'processing':
    case 'uploading':
      return 'text-vp-blue';
    case 'failed':
      return 'text-red-500';
    case 'pending':
    case 'discovered':
      return 'text-vp-orange';
    default:
      return 'text-vp-text-secondary';
  }
}

export function getBadgeStyles(badge: string): string {
  switch (badge) {
    case 'NEW':
      return 'bg-vp-blue text-white text-[10px] px-1.5 py-0.5 rounded-sm';
    case 'HOT':
      return 'bg-vp-red text-white text-[10px] px-1.5 py-0.5 rounded-sm animate-badge-pulse';
    case 'LIVE':
      return 'bg-vp-red text-white text-[10px] px-1.5 py-0.5 rounded-sm';
    case '4K':
      return 'bg-vp-surface-light text-vp-text-secondary text-[10px] px-1.5 py-0.5 rounded-sm border border-vp-surface';
    case 'HD':
      return 'bg-vp-surface-light text-vp-text-secondary text-[10px] px-1.5 py-0.5 rounded-sm border border-vp-surface';
    default:
      return 'bg-vp-surface-light text-vp-text-secondary text-[10px] px-1.5 py-0.5 rounded-sm';
  }
}
