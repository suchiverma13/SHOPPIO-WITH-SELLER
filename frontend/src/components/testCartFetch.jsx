import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const TestCartFetch = () => {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      if (!isSignedIn) {
        console.log("User is not signed in");
        return;
      }

      try {
        const token = await getToken();
        console.log("Clerk Token:", token);

        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await axios.get(`${backendUrl}/api/cart/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Backend cart response:", res.data);
      } catch (err) {
        console.error(
          "Error fetching cart:",
          err.response?.data || err.message
        );
      }
    };

    fetchCart();
  }, [getToken, isSignedIn]);

  return <div>Check console for cart fetch results</div>;
};

export default TestCartFetch;
