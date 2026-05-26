export default function ToothViewer({ className = '', decorative = false }) {
  return (
    <div className={`tooth-viewer ${className}`} aria-hidden={decorative ? 'true' : undefined}>
      <iframe
        title="Inside my Tooth 3D model"
        className="tooth-viewer-frame"
        src="https://sketchfab.com/models/5ebeadf0b40940ca93a4ced5cfe0abb2/embed?autostart=1&transparent=1&ui_infos=0&ui_controls=0&ui_watermark=0"
        frameBorder="0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
      />
    </div>
  );
}
