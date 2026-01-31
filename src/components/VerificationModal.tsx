"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  onVerificationSuccess: () => void;
}

export default function VerificationModal({
  isOpen,
  onClose,
  sessionId,
  onVerificationSuccess,
}: VerificationModalProps) {
  const [cnicFront, setCnicFront] = useState<File | null>(null);
  const [cnicBack, setCnicBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    if (!cnicFront || !cnicBack || !selfie) {
      toast.error(
        "Please upload all documents (CNIC Front, Back, and Selfie).",
      );
      return;
    }

    setIsLoading(true);
    try {
      // 1. Upload CNIC Front
      const cnicFormData = new FormData();
      cnicFormData.append("file", cnicFront);
      const cnicRes = await api.post("/upload-cnic", cnicFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const cnicUrl = cnicRes.data.url;

      // 2. Upload CNIC Back
      const cnicBackFormData = new FormData();
      cnicBackFormData.append("file", cnicBack);
      const cnicBackRes = await api.post("/upload-cnic", cnicBackFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const cnicBackUrl = cnicBackRes.data.url;

      // 3. Upload Selfie
      const selfieFormData = new FormData();
      selfieFormData.append("file", selfie);
      const selfieRes = await api.post("/upload-selfie", selfieFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const selfieUrl = selfieRes.data.url;

      // 4. Verify Identity
      const verifyRes = await api.post("/verify-face", {
        session_id: sessionId,
        cnic_url: cnicUrl,
        cnic_back_url: cnicBackUrl,
        selfie_url: selfieUrl,
      });

      if (verifyRes.data.verified) {
        toast.success("Identity Verified Successfuly!");
        onVerificationSuccess();
        onClose();
      } else {
        toast.error("Verification Failed. Please try again.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.detail ||
          "An error occurred during verification.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Identity Verification</DialogTitle>
          <DialogDescription>
            Please upload your CNIC (Front & Back) and a Selfie to proceed with
            the booking.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="cnic-front">CNIC Front</Label>
            <Input
              id="cnic-front"
              type="file"
              onChange={(e) => setCnicFront(e.target.files?.[0] || null)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="cnic-back">CNIC Back</Label>
            <Input
              id="cnic-back"
              type="file"
              onChange={(e) => setCnicBack(e.target.files?.[0] || null)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="selfie">Selfie</Label>
            <Input
              id="selfie"
              type="file"
              onChange={(e) => setSelfie(e.target.files?.[0] || null)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleUpload} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Verify & Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
