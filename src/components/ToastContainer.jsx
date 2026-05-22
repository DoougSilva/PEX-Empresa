export default function ToastContainer({ toasts }) {
  if (!toasts.length) return null
  return (
    <div id="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast${t.type ? ' toast-' + t.type : ''}`}>
          {t.msg}
        </div>
      ))}
    </div>
  )
}
