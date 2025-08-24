import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignUp path="/signup" routing="path" signInUrl="/login" />
    </div>
  );
}
