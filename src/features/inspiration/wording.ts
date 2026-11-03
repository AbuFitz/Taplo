/** How each example's booking behaves, in the words the booking journey itself uses. */
export const BOOKING_WORDS = {
  instant: "Booking confirms straight away: the customer sees “Confirmed appointment”.",
  request: "Booking sends a request: the business accepts or declines, and the customer sees “Pending request” until then.",
  contact: "There is no booking. Customers send an enquiry and nothing is reserved.",
} as const
