"use client";

import { useState, useMemo } from "react";
import { Input, Button, Link, Select, SelectItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    firstName: "",
    lastName: "",
    position: "",
    department: "",
    phone: "",
  });

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUpperAndLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "email") {
      validateEmail(value);
    } else if (name === "password") {
      validatePassword(value);
    } else if (name === "confirmPassword") {
      setPasswordsMatch(formData.password === value);
    }
  };

  const validateEmail = (email) => {
    const invalidCharsRegex = /[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~@-]/;
    const isValid = !invalidCharsRegex.test(email);
    setIsEmailValid(isValid);
    return isValid;
  };

  const validatePassword = (password) => {
    const criteria = {
      minLength: password.length >= 8,
      hasUpperAndLowercase: /[a-z]/.test(password) && /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordCriteria(criteria);
    return Object.values(criteria).every(Boolean);
  };

  const isInvalidEmail = useMemo(() => {
    return !isEmailValid && formData.email !== "";
  }, [isEmailValid, formData.email]);

  const isInvalidPassword = useMemo(() => {
    if (formData.password.length === 0) return false;
    return !validatePassword(formData.password);
  }, [formData.password]);

  const isInvalidConfirmPassword = useMemo(() => {
    if (formData.confirmPassword.length === 0) return false;
    return formData.password !== formData.confirmPassword;
  }, [formData.password, formData.confirmPassword]);

  const renderPasswordCriteria = () => {
    const criteriaItems = [
      { key: "minLength", label: "At least 8 characters" },
      {
        key: "hasUpperAndLowercase",
        label: "Contains upper and lowercase letter",
      },
      { key: "hasNumber", label: "Contains number" },
      { key: "hasSpecialChar", label: "Contains special character: !@#$%" },
    ];

    return (
      <div className="flex flex-col">
        {criteriaItems.map((item) => (
          <span
            key={item.key}
            className={`text-xs ${
              passwordCriteria[item.key] ? "text-green-600" : "text-red-600"
            }`}
          >
            {item.label}
          </span>
        ))}
      </div>
    );
  };

  const shouldShowPasswordCriteria =
    isPasswordFocused ||
    isConfirmPasswordFocused ||
    formData.password.length > 0 ||
    formData.confirmPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (step === 1) {
      if (isInvalidEmail || isInvalidPassword || isInvalidConfirmPassword) {
        return;
      }
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: formData.email }),
          }
        );

        if (!res.ok) throw new Error("Failed to check email");

        setStep(2);
      } catch (error) {
        console.error("Error checking email:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              companyName: formData.companyName,
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              password: formData.password,
              position: formData.position,
              department: formData.department,
              phone: formData.phone,
            }),
          }
        );

        if (!res.ok) throw new Error("Failed to create user");

        router.push("/auth/login");
      } catch (error) {
        console.error("Error create user: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md px-4 sm:px-0">
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {step === 1 ? "Sign Up" : "Additional Information"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <Input
                  type="email"
                  label="Email address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="md"
                  isInvalid={isInvalidEmail}
                  color={isInvalidEmail ? "danger" : "default"}
                  errorMessage={
                    isInvalidEmail ? "Please enter a valid email" : ""
                  }
                />
                <Input
                  type="password"
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  required
                  fullWidth
                  size="md"
                  isInvalid={isInvalidPassword}
                  color={isInvalidPassword ? "danger" : "default"}
                  errorMessage={
                    isInvalidPassword
                      ? "Password does not meet the criteria"
                      : ""
                  }
                />
                <Input
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setIsConfirmPasswordFocused(true)}
                  onBlur={() => setIsConfirmPasswordFocused(false)}
                  required
                  fullWidth
                  size="md"
                  isInvalid={isInvalidConfirmPassword}
                  color={isInvalidConfirmPassword ? "danger" : "default"}
                  errorMessage={
                    isInvalidConfirmPassword ? "Passwords do not match" : ""
                  }
                />
                {shouldShowPasswordCriteria && (
                  <div className="mt-2 mb-4">{renderPasswordCriteria()}</div>
                )}
              </>
            ) : (
              <>
                <Input
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="md"
                />
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="md"
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="md"
                />
                <Input
                  label="Position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  fullWidth
                  size="md"
                />
                <Input
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  fullWidth
                  size="md"
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  size="md"
                />
              </>
            )}
            <Button
              type="submit"
              color="primary"
              fullWidth
              size="md"
              isLoading={isLoading}
            >
              {isLoading
                ? ""
                : !isLoading && step === 1
                ? "Next"
                : "Complete Registration"}
            </Button>
          </form>
          {step === 1 && (
            <div className="mt-4 text-center text-sm sm:text-base">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/auth/login" size="sm" className="text-blue-600">
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
