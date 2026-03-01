const DemoBanner = () => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 sticky top-0 z-50 shadow-md">
      <div className="flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium text-sm md:text-base">
          ⚠️ <strong>Demo Project Only:</strong> This involves no real money. Please do not use real credit card information.
        </p>
      </div>
    </div>
  );
};

export default DemoBanner;