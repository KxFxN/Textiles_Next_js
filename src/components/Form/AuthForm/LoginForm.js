"use client";

import { useState } from "react";
import { Input, Button, Link } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      if (response.ok) {
        router.push("/");
      } else {
        const data = await response.json();
        setError(data.error || "An error occurred");
      }
    } catch (error) {
      console.error("error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md px-4 sm:px-0">
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
            Login
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              size="md"
            />
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              size="md"
            />
            <div className="text-right">
              <Link href="#" size="sm" className="text-blue-600">
                Forgot your password?
              </Link>
            </div>
            <Button
              type="submit"
              color="primary"
              fullWidth
              size="md"
              isLoading={isLoading}
            >
              {isLoading ? "" : "Sign in"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm sm:text-base">
            <span className="text-gray-600">
              Don&apos;t have an account yet?
            </span>
            <Link href="/auth/register" size="sm" className="text-blue-600">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
