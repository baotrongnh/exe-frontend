import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, ChevronDown, ChevronUp, FileText, Server, Wifi } from 'lucide-react'

export function TroubleshootingPanel() {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <Card className="mt-6 border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                        <CardTitle className="text-orange-800 text-lg">
                            Having upload issues?
                        </CardTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-orange-700 hover:text-orange-800"
                    >
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="pt-0">
                    <div className="space-y-4 text-sm text-orange-800">
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="flex items-start space-x-3">
                                <FileText className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium mb-1">File Requirements</h4>
                                    <ul className="space-y-1 text-orange-700">
                                        <li>• PDF files only</li>
                                        <li>• Maximum 5MB size</li>
                                        <li>• Clear, readable content</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Server className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium mb-1">Server Issues</h4>
                                    <ul className="space-y-1 text-orange-700">
                                        <li>• Upload directory errors</li>
                                        <li>• Temporary server problems</li>
                                        <li>• Storage configuration issues</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Wifi className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium mb-1">Quick Fixes</h4>
                                    <ul className="space-y-1 text-orange-700">
                                        <li>• Check internet connection</li>
                                        <li>• Try a smaller file</li>
                                        <li>• Refresh the page</li>
                                        <li>• Contact support if issue persists</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-orange-200">
                            <p className="text-orange-700">
                                <strong>Common Error:</strong> &ldquo;Server configuration error: Upload directory not found&rdquo;
                                indicates a backend setup issue that requires administrator attention.
                            </p>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}