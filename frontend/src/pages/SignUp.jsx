import React from "react";
import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div className="flex mt-20 justify-center items-center h-screen">
      <SignUp path="/signup" routing="path" signInUrl="/login" />
    </div>
  );
};

export default SignUpPage;
