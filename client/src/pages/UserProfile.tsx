import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ProfileSidebar } from "../components/profile/ProfileSidebar";
import { PersonalInfoForm } from "../components/profile/PersonalInfoForm";

export function UserProfile() {
  const [activeSection, setActiveSection] = useState<
    "personal" | "security" | "wishlist"
  >("personal");
  const { user } = useContext(AuthContext);

  const renderContent = () => {
    switch (activeSection) {
      case "personal":
        return <PersonalInfoForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <ProfileSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        user={user}
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
}
