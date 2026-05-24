import { useEscapeKey } from '../hooks/useEscapeKey'

export default function ConfirmModal({
  open,
  title       = 'Remover Assinatura?',
  message     = 'Esta ação não pode ser desfeita.',
  onConfirm,
  onCancel,
  confirmLabel = 'Remover',
  cancelLabel  = 'Cancelar',
}) {
  useEscapeKey(open, onCancel)

  if (!open) return null

  return (
    <div
      className="overlay-confirm active"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="confirm-box">
        <h3>{title}</h3>
        <p style={{ fontSize: 13, opacity: .8 }}>{message}</p>
        <div className="confirm-buttons">
          <button type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
