"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Helper component to load images via Axios (bypassing Ngrok warning)
const ProtectedImage = ({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      setBlobUrl(null);
      return;
    }

    let isMounted = true;
    const fetchImage = async () => {
      try {
        // Use 'api' instance which sends ngrok-skip-browser-warning header
        const res = await api.get(src, { responseType: "blob" });
        if (isMounted) {
          const url = URL.createObjectURL(res.data);
          setBlobUrl(url);
        }
      } catch (err) {
        console.error("Failed to load protected image:", src);
        if (isMounted) setBlobUrl(null);
      }
    };
    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [src]);

  if (!src)
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs p-4 rounded-md">
        No Image
      </div>
    );
  if (!blobUrl)
    return (
      <div className="w-full h-full bg-gray-200 animate-pulse rounded-md" />
    );

  return <img src={blobUrl} alt={alt} className={className} />;
};

interface Booking {
  id: string;
  user_id: string;
  car_type: string;
  pickup_date: string;
  return_date: string;
  total_price: number;
  status: string;
  user_name?: string;
  user_cnic?: string;
  user_photo?: string;
  user_cnic_front?: string;
  user_cnic_back?: string;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      if (Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        console.error("Unexpected API response:", res.data);
        setBookings([]);
        toast.error("Received invalid data from server.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch bookings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleApprove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click if any
    try {
      await api.post(`/update-status?booking_id=${id}&status=approved`);
      toast.success("Booking Approved!");
      fetchBookings(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve booking.");
    }
  };

  const getImageUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes("localhost:8000")) {
      const baseUrl = api.defaults.baseURL?.replace("/api", "") || "";
      return url.replace("http://localhost:8000", baseUrl);
    }
    return url;
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="rounded-md border p-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : (
          <Table>
            <TableCaption>A list of all recent bookings.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Booking ID</TableHead>
                <TableHead>Car Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Price (PKR)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border">
                          <ProtectedImage
                            src={getImageUrl(booking.user_photo) || null}
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold">
                            {booking.user_name || "Guest"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {booking.user_cnic || "No CNIC"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-xs">
                      {booking.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="capitalize">
                      {booking.car_type}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>
                          {new Date(booking.pickup_date).toLocaleDateString()}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          to
                        </span>
                        <span>
                          {new Date(booking.return_date).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.total_price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          booking.status === "approved"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* View Images Dialog */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              title="View Images"
                            >
                              <Eye className="w-4 h-4 mr-1" /> View Images
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                User Verification Documents
                              </DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                              <div className="flex flex-col items-center">
                                <h3 className="font-semibold mb-2">Selfie</h3>
                                <div className="w-full h-64 border rounded-md overflow-hidden bg-gray-50">
                                  <ProtectedImage
                                    src={
                                      getImageUrl(booking.user_photo) || null
                                    }
                                    alt="Selfie"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col items-center">
                                <h3 className="font-semibold mb-2">
                                  CNIC Front
                                </h3>
                                <div className="w-full h-64 border rounded-md overflow-hidden bg-gray-50">
                                  <ProtectedImage
                                    src={
                                      getImageUrl(booking.user_cnic_front) ||
                                      null
                                    }
                                    alt="CNIC Front"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col items-center">
                                <h3 className="font-semibold mb-2">
                                  CNIC Back
                                </h3>
                                <div className="w-full h-64 border rounded-md overflow-hidden bg-gray-50">
                                  <ProtectedImage
                                    src={
                                      getImageUrl(booking.user_cnic_back) ||
                                      null
                                    }
                                    alt="CNIC Back"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {booking.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={(e) => handleApprove(booking.id, e)}
                          >
                            Approve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
