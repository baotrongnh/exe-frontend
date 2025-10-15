import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, MoreVertical, Eye, Trash2, AlertTriangle } from 'lucide-react'
import type { CV } from './types'
import { formatDate, formatFileSize } from './utils'

interface CVCardProps {
    cv: CV
    onView: (cv: CV) => void
    onDelete: (id: string) => void
    showActionMenu: string | null
    onToggleActionMenu: (id: string | null) => void
}

export function CVCard({
    cv,
    onView,
    onDelete,
    showActionMenu,
    onToggleActionMenu
}: CVCardProps) {
    return (
        <Card
            className="relative cursor-pointer hover:shadow-lg transition-all duration-200 border hover:border-primary/20 h-auto"
            onClick={() => onView(cv)}
        >
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-base font-semibold text-foreground truncate">
                                {cv.name}
                            </CardTitle>
                        </div>
                    </div>
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                onToggleActionMenu(showActionMenu === cv.id ? null : cv.id)
                            }}
                        >
                            <MoreVertical className="w-4 h-4" />
                        </Button>

                        {showActionMenu === cv.id && (
                            <div className="absolute right-0 top-8 bg-card border rounded-lg shadow-lg py-1 z-10 w-32">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onView(cv)
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onDelete(cv.id)
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent text-destructive flex items-center"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>

            {/* PDF Preview */}
            {cv.previewUrl ? (
                <div className="px-6 pb-4">
                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <iframe
                            src={`${cv.previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                            className="w-full h-full scale-75 origin-top-left transform"
                            style={{ width: '133%', height: '133%' }}
                            title={`Preview of ${cv.name}`}
                        />
                    </div>
                </div>
            ) : (
                <div className="px-6 pb-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                        <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-orange-400 mr-2" />
                            <p className="text-sm text-orange-700">
                                {cv.isFileMissing ? 'File missing on server. Please re-upload.' : 'Preview unavailable'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {cv.description}
                </p>
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Uploaded: {formatDate(cv.uploadDate)}
                    </p>
                    {cv.fileSize && (
                        <p className="text-sm text-muted-foreground">
                            Size: {formatFileSize(cv.fileSize)}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}