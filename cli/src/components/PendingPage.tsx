interface PendingPageProps {
  onLogout: () => void;
  email: string;
  status: string;
}

export default function PendingPage({
  onLogout,
  email,
  status,
}: PendingPageProps) {
  const statusInfo = {
    pending: {
      title: "Account Pending Approval",
      message: `Your account (${email}) is awaiting approval from an administrator.`,
    },
    rejected: {
      title: "Account Rejected",
      message: `Your account (${email}) has been rejected. Please contact support.`,
    },
  };
  const currentStatus = status === "rejected" ? "rejected" : "pending";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-3xl font-bold mb-4">
        {statusInfo[currentStatus].title}
      </h1>
      <p className="text-gray-600 mb-6 max-w-md">
        {statusInfo[currentStatus].message}
      </p>
      <button
        onClick={onLogout}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
      >
        Return to Login
      </button>
    </div>
  );
}
