import { Document } from '@/types'

interface DocumentPreviewProps {
    document: Document | null
    isOpen: boolean
    onClose: () => void
}

export function DocumentPreview({ document, isOpen, onClose }: DocumentPreviewProps) {
    if (!isOpen || !document) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] w-full mx-4 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">{document.name}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                            {document.content}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    )
} 