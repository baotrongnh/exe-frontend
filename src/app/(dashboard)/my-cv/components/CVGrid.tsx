import React from 'react'
import { CVCard } from './CVCard'
import { EmptyState } from './EmptyState'
import { LoadingCVs } from './LoadingSpinner'
import type { CV } from './types'

interface CVGridProps {
    cvList: CV[]
    loading: boolean
    onView: (cv: CV) => void
    onDelete: (id: string) => void
    onUpload: () => void
    showActionMenu: string | null
    onToggleActionMenu: (id: string | null) => void
}

export function CVGrid({
    cvList,
    loading,
    onView,
    onDelete,
    onUpload,
    showActionMenu,
    onToggleActionMenu
}: CVGridProps) {
    if (loading) {
        return <LoadingCVs />
    }

    if (cvList.length === 0) {
        return <EmptyState onUpload={onUpload} />
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {cvList.map((cv) => (
                <CVCard
                    key={cv.id}
                    cv={cv}
                    onView={onView}
                    onDelete={onDelete}
                    showActionMenu={showActionMenu}
                    onToggleActionMenu={onToggleActionMenu}
                />
            ))}
        </div>
    )
}