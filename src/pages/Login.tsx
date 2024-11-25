import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      navigate("/");
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate("/");
      }
      if (event === 'USER_UPDATED') {
        navigate("/");
      }
      if (event === 'SIGNED_OUT') {
        navigate("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="light"
              providers={[]}
              onError={(error) => {
                if (error.message.includes("User already registered")) {
                  toast({
                    title: "Account exists",
                    description: "This email is already registered. Please sign in instead.",
                    variant: "destructive",
                  });
                } else {
                  toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                  });
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;