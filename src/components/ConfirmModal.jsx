/**
 * ConfirmModal — replica exata dos overlays overlay-confirm do HTML original
 * Props:
 *  - open      : boolean
 *  - message   : string  (default: 'Esta ação não pode ser desfeita.')
 *  - onConfirm : () => void
 *  - onCancel  : () => void
 *  - confirmLabel : string (default: 'Remover')
 *  - cancelLabel  : string (default: 'Cancelar')
 *  - title        : string (default: 'Remover Assinatura?')
 */
export default function ConfirmModal({
  open,
  title       = 'Remover Assinatura?',
  message     = 'Esta ação não pode ser desfeita.',
  onConfirm,
  onCancel,
  confirmLabel = 'Remover',
  cancelLabel  = 'Cancelar',
}) {
  if (!open) return null

  return (
    <div
      className="overlay-confirm active"
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="confirm-box">
        <h3>{title}</h3>
        <p style={{ fontSize: 13, opacity: .8 }}>{message}</p>
        <div className="confirm-buttons">
          <button id="btnConfirmDelete" type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button id="btnCancelDelete" type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
