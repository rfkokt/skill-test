"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Lock, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

interface ProblemCodeVerificationModalProps {
  isOpen: boolean;
  problemTitle: string;
  expectedCode: string;
  onVerify: (enteredCode: string) => boolean;
  onClose: () => void;
}

export default function ProblemCodeVerificationModal({
  isOpen,
  problemTitle,
  expectedCode,
  onVerify,
  onClose,
}: ProblemCodeVerificationModalProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setVerificationCode("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyClick = () => {
    if (!verificationCode.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    const isCorrect = onVerify(verificationCode.trim());
    if (!isCorrect) {
      setError("Incorrect verification code. Please try again.");
      setVerificationCode("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
    setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerifyClick();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neobrutal-card rounded-lg shadow-[8px_8px_0px_0px_#333333] border-2 border-neobrutal-border max-w-md w-full mx-4 text-neobrutal-text relative">
        <div className="p-8">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-neobrutal-text/60 hover:text-neobrutal-text transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-neobrutal-softBlue rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-neobrutal-border shadow-[2px_2px_0px_0px_#333333]">
              <Lock className="w-8 h-8 text-neobrutal-softBlueText" />
            </div>
            <h2 className="text-2xl font-bold text-neobrutal-text mb-2">
              Enter Verification Code
            </h2>
            <p className="text-neobrutal-text/90">
              To access <span className="font-semibold">"{problemTitle}"</span>,
              please enter the verification code.
            </p>
          </div>

          <div className="mb-6">
            <Input
              id="code"
              type="text"
              placeholder="Verification Code"
              value={verificationCode}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full bg-neobrutal-bg border-2 border-neobrutal-border shadow-[2px_2px_0px_0px_#333333] text-neobrutal-text"
              autoFocus
            />
            {error && (
              <p className="text-neobrutal-softRedText text-sm mt-2 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-8 py-3 bg-transparent border-2 border-neobrutal-border shadow-[2px_2px_0px_0px_#333333] hover:shadow-[1px_1px_0px_0px_#333333]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleVerifyClick}
              className="px-8 py-3 bg-neobrutal-softGreen hover:bg-neobrutal-softGreen/90 text-neobrutal-softGreenText border-2 border-neobrutal-border shadow-[2px_2px_0px_0px_#333333] hover:shadow-[1px_1px_0px_0px_#333333]"
            >
              Verify Code
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
