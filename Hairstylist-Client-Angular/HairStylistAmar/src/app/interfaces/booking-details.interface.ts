export interface BookingDetails {
  bookingId: string;
  batchId: string;
  batchName: string;
  amount: number;
  status: string;
  bookingDate: string;
  instructorName?: string;
  startDate?: string;
}
