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
import { Loader2 } from "lucide-react";

interface Booking {
  id: string;
  user_id: string;
  car_type: string;
  pickup_date: string;
  return_date: string;
  total_price: number;
  status: string;
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

  const handleApprove = async (id: string) => {
    try {
      await api.post(`/update-status?booking_id=${id}&status=approved`);
      toast.success("Booking Approved!");
      fetchBookings(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve booking.");
    }
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
                  <TableCell colSpan={6} className="text-center h-24">
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="capitalize">
                      {booking.car_type}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.pickup_date).toLocaleDateString()} -{" "}
                      {new Date(booking.return_date).toLocaleDateString()}
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
                      {booking.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(booking.id)}
                        >
                          Approve
                        </Button>
                      )}
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
