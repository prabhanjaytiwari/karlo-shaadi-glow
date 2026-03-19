import { z } from "zod";

// Contact Form Validation
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s'\-.]+$/, { message: "Name can only contain letters, spaces, hyphens, apostrophes, and dots" }),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, { message: "Invalid Indian phone number" })
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" })
});

// Booking Form Validation
export const bookingFormSchema = z.object({
  weddingDate: z
    .date()
    .min(new Date(), { message: "Wedding date must be in the future" }),
  guestCount: z
    .number()
    .int()
    .min(10, { message: "Minimum 10 guests required" })
    .max(10000, { message: "Maximum 10,000 guests allowed" })
    .optional(),
  specialRequirements: z
    .string()
    .trim()
    .max(500, { message: "Special requirements must be less than 500 characters" })
    .optional()
});

// Review Form Validation
export const reviewFormSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, { message: "Rating must be at least 1 star" })
    .max(5, { message: "Rating must be at most 5 stars" }),
  comment: z
    .string()
    .trim()
    .min(20, { message: "Review must be at least 20 characters" })
    .max(1000, { message: "Review must be less than 1000 characters" })
    .optional()
    .or(z.literal(""))
});

// Message Form Validation
export const messageFormSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, { message: "Message cannot be empty" })
    .max(2000, { message: "Message must be less than 2000 characters" })
});

// Profile Update Validation
export const profileUpdateSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, { message: "Invalid Indian phone number" })
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .trim()
    .max(100, { message: "City name must be less than 100 characters" })
    .optional(),
  weddingDate: z
    .date()
    .optional()
    .nullable(),
  budgetRange: z
    .string()
    .optional(),
  guestCount: z
    .number()
    .int()
    .min(1)
    .max(10000)
    .optional()
    .nullable()
});

// Vendor Service Validation
export const vendorServiceSchema = z.object({
  serviceName: z
    .string()
    .trim()
    .min(3, { message: "Service name must be at least 3 characters" })
    .max(100, { message: "Service name must be less than 100 characters" }),
  description: z
    .string()
    .trim()
    .min(20, { message: "Description must be at least 20 characters" })
    .max(500, { message: "Description must be less than 500 characters" })
    .optional(),
  basePrice: z
    .number()
    .min(0, { message: "Price cannot be negative" })
    .max(10000000, { message: "Price seems too high" })
    .optional()
    .nullable(),
  priceRangeMin: z
    .number()
    .min(0, { message: "Minimum price cannot be negative" })
    .optional()
    .nullable(),
  priceRangeMax: z
    .number()
    .min(0, { message: "Maximum price cannot be negative" })
    .optional()
    .nullable()
}).refine(
  (data) => {
    if (data.priceRangeMin && data.priceRangeMax) {
      return data.priceRangeMin <= data.priceRangeMax;
    }
    return true;
  },
  {
    message: "Minimum price must be less than or equal to maximum price",
    path: ["priceRangeMax"]
  }
);

// Search Query Validation
export const searchQuerySchema = z.object({
  query: z
    .string()
    .trim()
    .min(2, { message: "Search query must be at least 2 characters" })
    .max(100, { message: "Search query must be less than 100 characters" })
});

// WhatsApp Message Validation
export const whatsappMessageSchema = z.object({
  vendorName: z.string().trim().max(100),
  category: z.string().trim().max(50),
  weddingDate: z.string().optional()
});

// Login Form Validation
export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
});

// Signup Form Validation
export const signupFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s'\-.]+$/, { message: "Name can only contain letters, spaces, hyphens, apostrophes, and dots" }),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, { message: "Invalid Indian phone number (10 digits starting with 6-9)" })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
});

// Investor Inquiry Validation
export const investorInquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, { message: "Invalid Indian phone number" })
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .trim()
    .max(100, { message: "Company name must be less than 100 characters" })
    .optional()
    .or(z.literal("")),
  investmentRange: z
    .string()
    .trim()
    .max(50, { message: "Investment range must be less than 50 characters" })
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(2000, { message: "Message must be less than 2000 characters" })
    .optional()
    .or(z.literal(""))
});

// Support Form Validation
export const supportFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  subject: z
    .string()
    .trim()
    .min(3, { message: "Subject must be at least 3 characters" })
    .max(200, { message: "Subject must be less than 200 characters" }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(2000, { message: "Message must be less than 2000 characters" })
});

// Sanitize function for preventing XSS
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove < and > to prevent HTML injection
    .substring(0, 1000); // Limit length
};

// URL safe encoding for external APIs
export const encodeForUrl = (text: string): string => {
  return encodeURIComponent(sanitizeInput(text));
};
