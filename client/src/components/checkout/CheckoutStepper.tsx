import { Check } from 'lucide-react';

const steps = [
  { number: 1, label: 'Selection', active: false, completed: true },
  { number: 2, label: 'Details', active: false, completed: true },
  { number: 3, label: 'Payment', active: true, completed: false },
];

export function CheckoutStepper() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                {/* Step Circle */}
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      step.completed
                        ? 'bg-[#3c59c0] border-[#3c59c0] text-white'
                        : step.active
                        ? 'bg-white border-[#3c59c0] text-[#3c59c0] dark:bg-[#c8d4ff]'
                        : 'bg-white border-gray-300 text-gray-400 dark:bg-[#c8d4ff]'
                    }`}
                  >
                    {step.completed ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-s">{step.number}</span>
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm ${
                      step.active || step.completed
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400 dark:text-white'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 ${
                      step.completed ? 'bg-[#3c59c0]' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
    )
}