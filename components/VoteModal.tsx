"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userName: string, userEmail: string) => void;
  predictionTitle: string;
  vote: 'yes' | 'no';
  isSubmitting: boolean;
}

export function VoteModal({
  isOpen,
  onClose,
  onConfirm,
  predictionTitle,
  vote,
  isSubmitting
}: VoteModalProps) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};
    
    if (!userName.trim()) {
      newErrors.name = "Name is required";
    } else if (userName.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!userEmail.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      onConfirm(userName.trim(), userEmail.trim());
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setUserName("");
      setUserEmail("");
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Your Vote</DialogTitle>
          <DialogDescription>
            Please provide your details to vote on this prediction.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Prediction Preview */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Prediction:</p>
            <p className="text-sm text-muted-foreground mb-3">{predictionTitle}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm">Your vote:</span>
              <Badge variant={vote === 'yes' ? 'default' : 'secondary'}>
                {vote.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={isSubmitting}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                disabled={isSubmitting}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
            <p>
              Your email will be used to prevent duplicate voting and may be used 
              to contact you about prediction results. We respect your privacy and 
              won&apos;t share your information with third parties.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Confirm Vote"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
