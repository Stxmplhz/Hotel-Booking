interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

interface GuestDetailsFormProps {
  formData: FormData;
  onChange: (field: string, value: string) => void;
}

export const GuestDetailsForm = ({
  formData,
  onChange,
}: GuestDetailsFormProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-2xl text-gray-900 dark:text-white mb-6">
        Guest Details
      </h2>
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="firstName"
              className="text-sm text-gray-700 dark:text-gray-200 mb-2 block"
            >
              First Name
            </label>
            <input
              id="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              className="w-full px-4 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="text-sm text-gray-700 dark:text-gray-200 mb-2 block"
            >
              Last Name
            </label>
            <input
              id="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
              className="w-full px-4 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="email"
              className="text-sm text-gray-700 dark:text-gray-200 mb-2 block"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="w-full px-4 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="text-sm text-gray-700 dark:text-gray-200 mb-2 block"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className="w-full px-4 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="specialRequests"
            className="text-sm text-gray-700 dark:text-gray-200 mb-2 block"
          >
            Special Requests
          </label>
          <input
            id="specialRequests"
            placeholder="Special Requests e.g. Double Bed, Late night Check-in (There may be additional charges.)"
            value={formData.specialRequests}
            onChange={(e) => onChange("specialRequests", e.target.value)}
            className="w-full px-4 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};
