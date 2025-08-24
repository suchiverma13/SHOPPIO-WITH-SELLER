import { useLocation, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

const LoginWrapper = () => {
  const location = useLocation();
  const from = location.state?.from || "/"; // default home page
  return (
    <SignedIn>
      {window.location.replace(from)} {/* login ke baad redirect */}
    </SignedIn>
    <SignedOut>
      <RedirectToSignIn redirectUrl={from} />
    </SignedOut>
  );
};
