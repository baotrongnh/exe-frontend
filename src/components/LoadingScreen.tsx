export default function LoadingScreen() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
            <div className="text-center">
                {/* Logo */}
                <div className="flex items-center justify-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-white font-bold text-2xl">J</span>
                    </div>
                </div>

                {/* Spinner */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>

                {/* Text */}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h2>
                <p className="text-gray-600">Please wait while we prepare your experience</p>
            </div>
        </div>
    )
}
