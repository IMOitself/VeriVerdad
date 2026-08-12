export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div onClick={onClose} className="fixed inset-0 bg-[var(--color-primary)] opacity-50" />
			<div className="relative z-10 w-full max-w-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
				<div className="flex flex-col gap-1.5">
					<h2 className="text-base font-semibold text-[var(--color-text)] tracking-tight">{title}</h2>
					<p className="text-xs leading-relaxed text-[var(--color-text-muted)]">{message}</p>
				</div>
				<div className="flex items-center justify-end gap-3">
					<button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-[var(--color-text-muted)] bg-transparent rounded-lg hover:opacity-80 cursor-pointer">
						{cancelText}
					</button>
					<button type="button" onClick={onConfirm} className="px-4 py-2 text-xs font-semibold text-white bg-[var(--color-primary)] rounded-lg hover:opacity-80 cursor-pointer">
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	)
}