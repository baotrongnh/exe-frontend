import React from 'react'
import Messages from "@/app/(dashboard)/messages/page"

export default function EmployerMessages() {
    return (
        <div className="h-full">
            <Messages basePath="/employer" />
        </div>
    )
}
