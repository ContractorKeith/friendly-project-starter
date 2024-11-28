import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSession, AuthChangeEvent } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      console.log("Session exists, redirecting to home");
      navigate("/");
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in, redirecting to home");
        navigate("/");
      }
      if (event === 'USER_UPDATED') {
        console.log("User updated, redirecting to home");
        navigate("/");
      }
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, redirecting to login");
        navigate("/login");
      }
      if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Password Recovery",
          description: "Please check your email for password reset instructions.",
        });
      }

      // Handle registration errors
      if (event === 'INITIAL_SESSION' && !session && window.location.hash.includes('error')) {
        const errorDescription = new URLSearchParams(window.location.hash.substring(1)).get('error_description');
        if (errorDescription?.includes('User already registered')) {
          toast({
            title: "Error",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
        }
      }
    });

    // Check for password reset or email verification in URL
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      toast({
        title: "Password Reset",
        description: "Please enter your new password.",
      });
    } else if (hash.includes('type=signup')) {
      toast({
        title: "Email Verification",
        description: "Thank you for verifying your email.",
      });
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [session, navigate, toast]);

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
              redirectTo={`${window.location.origin}/auth/callback`}
              showLinks={true}
              view="sign_in"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;