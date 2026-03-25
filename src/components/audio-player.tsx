import { useAudioStore, TRACKS } from '../stores/audio-store'

export default function AudioPlayer() {
  const { activeTrackId, playing, volume, toggle, setVolume } = useAudioStore()

  return (
    <div className="flex items-center gap-1.5">
      {TRACKS.map((track) => {
        const isActive = activeTrackId === track.id && playing
        return (
          <button
            key={track.id}
            onClick={() => toggle(track.id)}
            title={track.label}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm
              transition-all duration-200
              ${isActive
                ? 'bg-garden-light/30 scale-110'
                : 'hover:bg-cream-dark/50 opacity-60 hover:opacity-100'
              }`}
          >
            {track.emoji}
          </button>
        )
      })}
      {/* Volume slider */}
      {playing && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-16 h-1 accent-garden cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
          title={`音量 ${Math.round(volume * 100)}%`}
        />
      )}
    </div>
  )
}
