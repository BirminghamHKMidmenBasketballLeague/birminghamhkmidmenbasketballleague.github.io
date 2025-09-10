import { useRef, useState } from 'react'

export interface UrlVideo {
  name: string
  url: string
  description: string
}

interface UrlVideoPlayerProps {
  data: UrlVideo
}

function isYouTubeUrl(url: string) {
  return /youtube\.com|youtu\.be/.test(url)
}

export default function UrlVideoPlayer({ data }: UrlVideoPlayerProps) {
  const [error, setError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const shouldShowButton = error || isYouTubeUrl(data.url)

  return (
    <div
      className={
        shouldShowButton
          ? 'h-40 flex items-center justify-center bg-black rounded-lg'
          : 'aspect-4/3 overflow-hidden rounded-lg flex items-center justify-center bg-black'
      }
    >
      {!shouldShowButton ? (
        <iframe
          ref={iframeRef}
          src={data.url}
          title={data.name}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          onError={() => setError(true)}
        />
      ) : (
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          style={{ backgroundColor: 'transparent' }}
        >
          <img
            src="/images/video-thumb/youtube-icon-84.svg"
            alt="Play"
            className="w-10 h-10"
          />
        </a>
      )}
    </div>
  )
}
