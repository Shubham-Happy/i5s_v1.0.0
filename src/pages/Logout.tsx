
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const Logout = () => {
  const { signOut } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      await signOut();
    };

    handleLogout();
  }, [signOut]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <p className="text-muted-foreground">Please wait while we log you out.</p>
        <div className="mt-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
