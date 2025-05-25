export default function ConfirmInvalid() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-red-400 text-center">
        <h1 className="text-3xl font-bold mb-6">❌ Invalid or Expired Confirmation Link</h1>
        <p className="text-lg">Please register again or contact support.</p>
      </div>
    );
  }
  