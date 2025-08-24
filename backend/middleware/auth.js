import { requireAuth } from "@clerk/express";

// ✅ Clerk ka requireAuth middleware use karo
const authUser = requireAuth();

export default authUser;
