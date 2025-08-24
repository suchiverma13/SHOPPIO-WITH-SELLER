import { useLocation, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

const LoginWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const state = location.state; // { from, product, size }
  const target = state?.from || "/";

  useEffect(() => {
    if (isSignedIn) {
      // agar Buy Now ke saath aya tha, product info bhi pass karo
      if (state?.product && state?.size) {
        navigate(target, { state }); 
      } else {
        navigate(target); // cart ya normal redirect
      }
    }
  }, [isSignedIn, navigate, state, target]);

  return (
    <>
      <SignedIn>
        <div>Redirecting...</div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl="/login" />
      </SignedOut>
    </>
  );
};

export default LoginWrapper;
