const DisclaimerText = () => {
    return (
        <p className="text-xs text-gray-500 dark:text-gray-200 text-center mt-3">
            By confirming, you agree to our{' '}
            <a href="#" className="text-[#809cff] hover:underline">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-[#809cff] hover:underline">Privacy Policy</a>
        </p>
    )
}
export default DisclaimerText;