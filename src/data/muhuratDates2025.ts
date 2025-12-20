export interface MuhuratDate {
  date: string;
  day: string;
  nakshatra: string;
  tithi: string;
  timing: string;
  rating: 1 | 2 | 3 | 4 | 5;
  notes: string;
  month: number;
  year: number;
}

export const MUHURAT_2025: MuhuratDate[] = [
  // January 2025
  { date: "2025-01-14", day: "Tuesday", nakshatra: "Rohini", tithi: "Purnima", timing: "7:15 AM - 1:30 PM", rating: 5, notes: "Makar Sankranti - Highly Auspicious", month: 1, year: 2025 },
  { date: "2025-01-15", day: "Wednesday", nakshatra: "Mrigashira", tithi: "Krishna Pratipada", timing: "10:00 AM - 6:00 PM", rating: 4, notes: "", month: 1, year: 2025 },
  { date: "2025-01-17", day: "Friday", nakshatra: "Ardra", tithi: "Krishna Tritiya", timing: "11:30 AM - 5:00 PM", rating: 4, notes: "Friday - Great for weddings", month: 1, year: 2025 },
  { date: "2025-01-19", day: "Sunday", nakshatra: "Punarvasu", tithi: "Krishna Panchami", timing: "9:00 AM - 3:00 PM", rating: 3, notes: "", month: 1, year: 2025 },
  { date: "2025-01-22", day: "Wednesday", nakshatra: "Pushya", tithi: "Krishna Ashtami", timing: "8:30 AM - 2:00 PM", rating: 5, notes: "Pushya Nakshatra - Very Auspicious", month: 1, year: 2025 },
  { date: "2025-01-24", day: "Friday", nakshatra: "Ashlesha", tithi: "Krishna Dashami", timing: "11:00 AM - 5:30 PM", rating: 4, notes: "", month: 1, year: 2025 },
  { date: "2025-01-26", day: "Sunday", nakshatra: "Magha", tithi: "Krishna Dwadashi", timing: "10:30 AM - 4:00 PM", rating: 4, notes: "Republic Day Weekend", month: 1, year: 2025 },
  { date: "2025-01-29", day: "Wednesday", nakshatra: "Uttara Phalguni", tithi: "Amavasya", timing: "7:00 AM - 12:00 PM", rating: 3, notes: "", month: 1, year: 2025 },
  
  // February 2025 (Peak Wedding Season)
  { date: "2025-02-02", day: "Sunday", nakshatra: "Hasta", tithi: "Shukla Chaturthi", timing: "9:00 AM - 3:30 PM", rating: 4, notes: "", month: 2, year: 2025 },
  { date: "2025-02-04", day: "Tuesday", nakshatra: "Chitra", tithi: "Shukla Shashthi", timing: "7:00 AM - 12:30 PM", rating: 4, notes: "Basant Panchami Week", month: 2, year: 2025 },
  { date: "2025-02-06", day: "Thursday", nakshatra: "Swati", tithi: "Shukla Ashtami", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 2, year: 2025 },
  { date: "2025-02-09", day: "Sunday", nakshatra: "Anuradha", tithi: "Shukla Ekadashi", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Ekadashi - Highly Auspicious", month: 2, year: 2025 },
  { date: "2025-02-12", day: "Wednesday", nakshatra: "Mula", tithi: "Purnima", timing: "7:30 AM - 1:00 PM", rating: 5, notes: "Valentine's Week - Popular!", month: 2, year: 2025 },
  { date: "2025-02-14", day: "Friday", nakshatra: "Purva Ashadha", tithi: "Krishna Dwitiya", timing: "11:00 AM - 5:00 PM", rating: 5, notes: "Valentine's Day - Very Popular!", month: 2, year: 2025 },
  { date: "2025-02-16", day: "Sunday", nakshatra: "Shravana", tithi: "Krishna Chaturthi", timing: "9:30 AM - 3:30 PM", rating: 4, notes: "", month: 2, year: 2025 },
  { date: "2025-02-19", day: "Wednesday", nakshatra: "Shatabhisha", tithi: "Krishna Saptami", timing: "10:00 AM - 4:30 PM", rating: 4, notes: "", month: 2, year: 2025 },
  { date: "2025-02-21", day: "Friday", nakshatra: "Purva Bhadrapada", tithi: "Krishna Navami", timing: "8:30 AM - 2:30 PM", rating: 4, notes: "", month: 2, year: 2025 },
  { date: "2025-02-23", day: "Sunday", nakshatra: "Uttara Bhadrapada", tithi: "Krishna Ekadashi", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 2, year: 2025 },
  { date: "2025-02-26", day: "Wednesday", nakshatra: "Ashwini", tithi: "Amavasya", timing: "7:00 AM - 11:00 AM", rating: 3, notes: "", month: 2, year: 2025 },
  
  // March 2025
  { date: "2025-03-02", day: "Sunday", nakshatra: "Rohini", tithi: "Shukla Tritiya", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Rohini - Most Auspicious Nakshatra", month: 3, year: 2025 },
  { date: "2025-03-05", day: "Wednesday", nakshatra: "Mrigashira", tithi: "Shukla Shashthi", timing: "10:30 AM - 4:30 PM", rating: 4, notes: "", month: 3, year: 2025 },
  { date: "2025-03-07", day: "Friday", nakshatra: "Punarvasu", tithi: "Shukla Ashtami", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 3, year: 2025 },
  { date: "2025-03-10", day: "Monday", nakshatra: "Pushya", tithi: "Shukla Ekadashi", timing: "7:00 AM - 12:00 PM", rating: 5, notes: "Pushya + Ekadashi - Excellent!", month: 3, year: 2025 },
  { date: "2025-03-13", day: "Thursday", nakshatra: "Uttara Phalguni", tithi: "Purnima", timing: "6:30 AM - 12:30 PM", rating: 5, notes: "Holi Purnima - Festival Season", month: 3, year: 2025 },
  { date: "2025-03-19", day: "Wednesday", nakshatra: "Vishakha", tithi: "Krishna Shashthi", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 3, year: 2025 },
  { date: "2025-03-23", day: "Sunday", nakshatra: "Jyeshtha", tithi: "Krishna Dashami", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 3, year: 2025 },
  { date: "2025-03-26", day: "Wednesday", nakshatra: "Shravana", tithi: "Krishna Trayodashi", timing: "8:00 AM - 2:00 PM", rating: 4, notes: "", month: 3, year: 2025 },
  
  // April 2025
  { date: "2025-04-02", day: "Wednesday", nakshatra: "Ashwini", tithi: "Shukla Panchami", timing: "7:30 AM - 1:30 PM", rating: 4, notes: "Chaitra Navratri", month: 4, year: 2025 },
  { date: "2025-04-06", day: "Sunday", nakshatra: "Rohini", tithi: "Shukla Navami", timing: "9:00 AM - 3:00 PM", rating: 5, notes: "Ram Navami", month: 4, year: 2025 },
  { date: "2025-04-10", day: "Thursday", nakshatra: "Ardra", tithi: "Shukla Trayodashi", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 4, year: 2025 },
  { date: "2025-04-13", day: "Sunday", nakshatra: "Pushya", tithi: "Purnima", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Hanuman Jayanti", month: 4, year: 2025 },
  { date: "2025-04-17", day: "Thursday", nakshatra: "Magha", tithi: "Krishna Chaturthi", timing: "9:30 AM - 3:30 PM", rating: 4, notes: "", month: 4, year: 2025 },
  { date: "2025-04-20", day: "Sunday", nakshatra: "Chitra", tithi: "Krishna Saptami", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 4, year: 2025 },
  { date: "2025-04-24", day: "Thursday", nakshatra: "Anuradha", tithi: "Krishna Ekadashi", timing: "8:30 AM - 2:30 PM", rating: 4, notes: "", month: 4, year: 2025 },
  { date: "2025-04-27", day: "Sunday", nakshatra: "Uttara Ashadha", tithi: "Amavasya", timing: "6:00 AM - 11:00 AM", rating: 3, notes: "", month: 4, year: 2025 },
  
  // May 2025 (Peak Season)
  { date: "2025-05-02", day: "Friday", nakshatra: "Rohini", tithi: "Shukla Chaturthi", timing: "5:30 AM - 11:00 AM", rating: 5, notes: "Akshaya Tritiya Week - Most Auspicious!", month: 5, year: 2025 },
  { date: "2025-05-04", day: "Sunday", nakshatra: "Mrigashira", tithi: "Shukla Shashthi", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Akshaya Tritiya Period", month: 5, year: 2025 },
  { date: "2025-05-07", day: "Wednesday", nakshatra: "Punarvasu", tithi: "Shukla Navami", timing: "9:00 AM - 3:00 PM", rating: 5, notes: "", month: 5, year: 2025 },
  { date: "2025-05-09", day: "Friday", nakshatra: "Pushya", tithi: "Shukla Ekadashi", timing: "7:00 AM - 1:00 PM", rating: 5, notes: "Pushya + Friday - Excellent!", month: 5, year: 2025 },
  { date: "2025-05-12", day: "Monday", nakshatra: "Uttara Phalguni", tithi: "Purnima", timing: "6:30 AM - 12:00 PM", rating: 5, notes: "Buddha Purnima", month: 5, year: 2025 },
  { date: "2025-05-15", day: "Thursday", nakshatra: "Chitra", tithi: "Krishna Tritiya", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 5, year: 2025 },
  { date: "2025-05-18", day: "Sunday", nakshatra: "Swati", tithi: "Krishna Shashthi", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 5, year: 2025 },
  { date: "2025-05-21", day: "Wednesday", nakshatra: "Jyeshtha", tithi: "Krishna Navami", timing: "8:30 AM - 2:30 PM", rating: 4, notes: "", month: 5, year: 2025 },
  { date: "2025-05-25", day: "Sunday", nakshatra: "Purva Ashadha", tithi: "Krishna Trayodashi", timing: "9:30 AM - 3:30 PM", rating: 4, notes: "", month: 5, year: 2025 },
  { date: "2025-05-28", day: "Wednesday", nakshatra: "Dhanishta", tithi: "Amavasya", timing: "5:30 AM - 10:30 AM", rating: 3, notes: "", month: 5, year: 2025 },
  
  // June 2025
  { date: "2025-06-01", day: "Sunday", nakshatra: "Ashwini", tithi: "Shukla Chaturthi", timing: "8:00 AM - 2:00 PM", rating: 4, notes: "", month: 6, year: 2025 },
  { date: "2025-06-05", day: "Thursday", nakshatra: "Rohini", tithi: "Shukla Ashtami", timing: "7:30 AM - 1:30 PM", rating: 5, notes: "Rohini Nakshatra", month: 6, year: 2025 },
  { date: "2025-06-08", day: "Sunday", nakshatra: "Punarvasu", tithi: "Shukla Ekadashi", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 6, year: 2025 },
  { date: "2025-06-11", day: "Wednesday", nakshatra: "Ashlesha", tithi: "Purnima", timing: "6:00 AM - 12:00 PM", rating: 4, notes: "Vat Purnima", month: 6, year: 2025 },
  { date: "2025-06-15", day: "Sunday", nakshatra: "Hasta", tithi: "Krishna Chaturthi", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 6, year: 2025 },
  { date: "2025-06-19", day: "Thursday", nakshatra: "Vishakha", tithi: "Krishna Ashtami", timing: "9:00 AM - 3:00 PM", rating: 3, notes: "", month: 6, year: 2025 },
  { date: "2025-06-22", day: "Sunday", nakshatra: "Anuradha", tithi: "Krishna Ekadashi", timing: "8:00 AM - 2:00 PM", rating: 4, notes: "", month: 6, year: 2025 },
  
  // July 2025 (Sawan - Limited)
  { date: "2025-07-03", day: "Thursday", nakshatra: "Rohini", tithi: "Shukla Ashtami", timing: "8:00 AM - 2:00 PM", rating: 4, notes: "Before Sawan starts", month: 7, year: 2025 },
  { date: "2025-07-06", day: "Sunday", nakshatra: "Punarvasu", tithi: "Shukla Ekadashi", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 7, year: 2025 },
  { date: "2025-07-10", day: "Thursday", nakshatra: "Magha", tithi: "Purnima", timing: "7:00 AM - 1:00 PM", rating: 4, notes: "Guru Purnima", month: 7, year: 2025 },
  
  // August 2025 (Shravan - Limited)
  { date: "2025-08-09", day: "Saturday", nakshatra: "Uttara Phalguni", tithi: "Purnima", timing: "7:30 AM - 12:00 PM", rating: 4, notes: "Raksha Bandhan", month: 8, year: 2025 },
  { date: "2025-08-16", day: "Saturday", nakshatra: "Vishakha", tithi: "Krishna Ashtami", timing: "9:00 AM - 2:00 PM", rating: 5, notes: "Krishna Janmashtami - Auspicious!", month: 8, year: 2025 },
  { date: "2025-08-27", day: "Wednesday", nakshatra: "Shatabhisha", tithi: "Shukla Chaturthi", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "Ganesh Chaturthi", month: 8, year: 2025 },
  
  // September 2025
  { date: "2025-09-07", day: "Sunday", nakshatra: "Mrigashira", tithi: "Purnima", timing: "8:00 AM - 2:00 PM", rating: 4, notes: "", month: 9, year: 2025 },
  { date: "2025-09-14", day: "Sunday", nakshatra: "Chitra", tithi: "Krishna Ashtami", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 9, year: 2025 },
  { date: "2025-09-21", day: "Sunday", nakshatra: "Uttara Ashadha", tithi: "Amavasya", timing: "6:30 AM - 11:30 AM", rating: 3, notes: "", month: 9, year: 2025 },
  { date: "2025-09-26", day: "Friday", nakshatra: "Revati", tithi: "Shukla Panchami", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "Navratri Begins", month: 9, year: 2025 },
  { date: "2025-09-29", day: "Monday", nakshatra: "Rohini", tithi: "Shukla Ashtami", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Durga Ashtami", month: 9, year: 2025 },
  
  // October 2025
  { date: "2025-10-02", day: "Thursday", nakshatra: "Punarvasu", tithi: "Shukla Dashami", timing: "7:30 AM - 1:30 PM", rating: 5, notes: "Dussehra - Very Auspicious!", month: 10, year: 2025 },
  { date: "2025-10-07", day: "Tuesday", nakshatra: "Uttara Phalguni", tithi: "Purnima", timing: "9:00 AM - 3:00 PM", rating: 5, notes: "Sharad Purnima", month: 10, year: 2025 },
  { date: "2025-10-16", day: "Thursday", nakshatra: "Anuradha", tithi: "Krishna Navami", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 10, year: 2025 },
  { date: "2025-10-20", day: "Monday", nakshatra: "Purva Ashadha", tithi: "Krishna Trayodashi", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Dhanteras", month: 10, year: 2025 },
  { date: "2025-10-23", day: "Thursday", nakshatra: "Dhanishta", tithi: "Amavasya", timing: "7:00 AM - 12:00 PM", rating: 5, notes: "Diwali - Lakshmi Puja", month: 10, year: 2025 },
  { date: "2025-10-27", day: "Monday", nakshatra: "Uttara Bhadrapada", tithi: "Shukla Chaturthi", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 10, year: 2025 },
  
  // November 2025 (Peak Season)
  { date: "2025-11-01", day: "Saturday", nakshatra: "Rohini", tithi: "Shukla Dashami", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Dev Uthani Ekadashi Eve", month: 11, year: 2025 },
  { date: "2025-11-02", day: "Sunday", nakshatra: "Mrigashira", tithi: "Shukla Ekadashi", timing: "6:30 AM - 12:30 PM", rating: 5, notes: "Dev Uthani Ekadashi - Best Day!", month: 11, year: 2025 },
  { date: "2025-11-05", day: "Wednesday", nakshatra: "Punarvasu", tithi: "Purnima", timing: "9:00 AM - 3:00 PM", rating: 5, notes: "Kartik Purnima", month: 11, year: 2025 },
  { date: "2025-11-09", day: "Sunday", nakshatra: "Magha", tithi: "Krishna Chaturthi", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 11, year: 2025 },
  { date: "2025-11-12", day: "Wednesday", nakshatra: "Hasta", tithi: "Krishna Saptami", timing: "9:30 AM - 3:30 PM", rating: 4, notes: "", month: 11, year: 2025 },
  { date: "2025-11-16", day: "Sunday", nakshatra: "Anuradha", tithi: "Krishna Ekadashi", timing: "8:00 AM - 2:00 PM", rating: 4, notes: "", month: 11, year: 2025 },
  { date: "2025-11-20", day: "Thursday", nakshatra: "Uttara Ashadha", tithi: "Amavasya", timing: "7:00 AM - 11:00 AM", rating: 3, notes: "", month: 11, year: 2025 },
  { date: "2025-11-23", day: "Sunday", nakshatra: "Shatabhisha", tithi: "Shukla Tritiya", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 11, year: 2025 },
  { date: "2025-11-26", day: "Wednesday", nakshatra: "Uttara Bhadrapada", tithi: "Shukla Shashthi", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 11, year: 2025 },
  { date: "2025-11-28", day: "Friday", nakshatra: "Ashwini", tithi: "Shukla Ashtami", timing: "8:30 AM - 2:30 PM", rating: 5, notes: "Friday + Ashwini - Excellent!", month: 11, year: 2025 },
  { date: "2025-11-30", day: "Sunday", nakshatra: "Rohini", tithi: "Shukla Dashami", timing: "7:00 AM - 1:00 PM", rating: 5, notes: "Rohini - Most Auspicious", month: 11, year: 2025 },
  
  // December 2025 (Peak Season)
  { date: "2025-12-03", day: "Wednesday", nakshatra: "Mrigashira", tithi: "Shukla Trayodashi", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 12, year: 2025 },
  { date: "2025-12-05", day: "Friday", nakshatra: "Punarvasu", tithi: "Purnima", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Margashirsha Purnima", month: 12, year: 2025 },
  { date: "2025-12-07", day: "Sunday", nakshatra: "Pushya", tithi: "Krishna Dwitiya", timing: "10:00 AM - 4:00 PM", rating: 5, notes: "Pushya - Very Auspicious", month: 12, year: 2025 },
  { date: "2025-12-10", day: "Wednesday", nakshatra: "Magha", tithi: "Krishna Panchami", timing: "9:30 AM - 3:30 PM", rating: 4, notes: "", month: 12, year: 2025 },
  { date: "2025-12-12", day: "Friday", nakshatra: "Uttara Phalguni", tithi: "Krishna Saptami", timing: "8:30 AM - 2:30 PM", rating: 4, notes: "", month: 12, year: 2025 },
  { date: "2025-12-14", day: "Sunday", nakshatra: "Chitra", tithi: "Krishna Navami", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 12, year: 2025 },
  { date: "2025-12-17", day: "Wednesday", nakshatra: "Anuradha", tithi: "Krishna Dwadashi", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 12, year: 2025 },
  { date: "2025-12-21", day: "Sunday", nakshatra: "Shravana", tithi: "Amavasya", timing: "7:30 AM - 12:30 PM", rating: 3, notes: "", month: 12, year: 2025 },
  { date: "2025-12-25", day: "Thursday", nakshatra: "Uttara Bhadrapada", tithi: "Shukla Panchami", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "Christmas - Modern couples", month: 12, year: 2025 },
  { date: "2025-12-28", day: "Sunday", nakshatra: "Ashwini", tithi: "Shukla Ashtami", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 12, year: 2025 },
  { date: "2025-12-31", day: "Wednesday", nakshatra: "Rohini", tithi: "Shukla Ekadashi", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "New Year's Eve - Rohini!", month: 12, year: 2025 },
];

export const MUHURAT_2026: MuhuratDate[] = [
  // January 2026
  { date: "2026-01-04", day: "Sunday", nakshatra: "Punarvasu", tithi: "Purnima", timing: "7:30 AM - 1:30 PM", rating: 5, notes: "New Year Purnima", month: 1, year: 2026 },
  { date: "2026-01-08", day: "Thursday", nakshatra: "Magha", tithi: "Krishna Chaturthi", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 1, year: 2026 },
  { date: "2026-01-11", day: "Sunday", nakshatra: "Chitra", tithi: "Krishna Saptami", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 1, year: 2026 },
  { date: "2026-01-14", day: "Wednesday", nakshatra: "Swati", tithi: "Krishna Dashami", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Makar Sankranti - Highly Auspicious", month: 1, year: 2026 },
  { date: "2026-01-18", day: "Sunday", nakshatra: "Mula", tithi: "Amavasya", timing: "7:00 AM - 12:00 PM", rating: 3, notes: "", month: 1, year: 2026 },
  { date: "2026-01-22", day: "Thursday", nakshatra: "Shatabhisha", tithi: "Shukla Chaturthi", timing: "9:30 AM - 3:30 PM", rating: 4, notes: "", month: 1, year: 2026 },
  { date: "2026-01-25", day: "Sunday", nakshatra: "Ashwini", tithi: "Shukla Saptami", timing: "8:00 AM - 2:00 PM", rating: 4, notes: "Republic Day Eve", month: 1, year: 2026 },
  { date: "2026-01-28", day: "Wednesday", nakshatra: "Rohini", tithi: "Shukla Dashami", timing: "7:30 AM - 1:30 PM", rating: 5, notes: "Rohini - Most Auspicious", month: 1, year: 2026 },
  { date: "2026-01-31", day: "Saturday", nakshatra: "Punarvasu", tithi: "Shukla Trayodashi", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 1, year: 2026 },
  
  // February 2026 (Peak Season)
  { date: "2026-02-02", day: "Monday", nakshatra: "Pushya", tithi: "Purnima", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Pushya Purnima - Excellent!", month: 2, year: 2026 },
  { date: "2026-02-06", day: "Friday", nakshatra: "Uttara Phalguni", tithi: "Krishna Chaturthi", timing: "9:30 AM - 3:30 PM", rating: 4, notes: "Friday - Great for weddings", month: 2, year: 2026 },
  { date: "2026-02-10", day: "Tuesday", nakshatra: "Vishakha", tithi: "Krishna Ashtami", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 2, year: 2026 },
  { date: "2026-02-13", day: "Friday", nakshatra: "Anuradha", tithi: "Krishna Ekadashi", timing: "8:30 AM - 2:30 PM", rating: 4, notes: "Valentine's Eve", month: 2, year: 2026 },
  { date: "2026-02-14", day: "Saturday", nakshatra: "Jyeshtha", tithi: "Krishna Dwadashi", timing: "9:00 AM - 3:00 PM", rating: 5, notes: "Valentine's Day - Very Popular!", month: 2, year: 2026 },
  { date: "2026-02-17", day: "Tuesday", nakshatra: "Uttara Ashadha", tithi: "Amavasya", timing: "7:00 AM - 12:00 PM", rating: 3, notes: "", month: 2, year: 2026 },
  { date: "2026-02-20", day: "Friday", nakshatra: "Shatabhisha", tithi: "Shukla Tritiya", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 2, year: 2026 },
  { date: "2026-02-22", day: "Sunday", nakshatra: "Uttara Bhadrapada", tithi: "Shukla Panchami", timing: "8:00 AM - 2:00 PM", rating: 4, notes: "", month: 2, year: 2026 },
  { date: "2026-02-25", day: "Wednesday", nakshatra: "Ashwini", tithi: "Shukla Ashtami", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 2, year: 2026 },
  { date: "2026-02-27", day: "Friday", nakshatra: "Rohini", tithi: "Shukla Dashami", timing: "7:30 AM - 1:30 PM", rating: 5, notes: "Rohini + Friday - Excellent!", month: 2, year: 2026 },
  
  // March 2026
  { date: "2026-03-03", day: "Tuesday", nakshatra: "Punarvasu", tithi: "Purnima", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Holi Purnima", month: 3, year: 2026 },
  { date: "2026-03-06", day: "Friday", nakshatra: "Ashlesha", tithi: "Krishna Tritiya", timing: "9:30 AM - 3:30 PM", rating: 4, notes: "", month: 3, year: 2026 },
  { date: "2026-03-10", day: "Tuesday", nakshatra: "Hasta", tithi: "Krishna Saptami", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 3, year: 2026 },
  { date: "2026-03-15", day: "Sunday", nakshatra: "Anuradha", tithi: "Krishna Dwadashi", timing: "8:00 AM - 2:00 PM", rating: 4, notes: "", month: 3, year: 2026 },
  { date: "2026-03-19", day: "Thursday", nakshatra: "Shravana", tithi: "Amavasya", timing: "7:00 AM - 12:00 PM", rating: 3, notes: "", month: 3, year: 2026 },
  { date: "2026-03-22", day: "Sunday", nakshatra: "Uttara Bhadrapada", tithi: "Shukla Tritiya", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "Chaitra Navratri", month: 3, year: 2026 },
  { date: "2026-03-25", day: "Wednesday", nakshatra: "Bharani", tithi: "Shukla Shashthi", timing: "8:30 AM - 2:30 PM", rating: 4, notes: "", month: 3, year: 2026 },
  { date: "2026-03-28", day: "Saturday", nakshatra: "Rohini", tithi: "Shukla Navami", timing: "7:30 AM - 1:30 PM", rating: 5, notes: "Rohini - Ram Navami", month: 3, year: 2026 },
  { date: "2026-03-30", day: "Monday", nakshatra: "Ardra", tithi: "Shukla Ekadashi", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 3, year: 2026 },
  
  // April 2026
  { date: "2026-04-02", day: "Thursday", nakshatra: "Pushya", tithi: "Purnima", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Hanuman Jayanti", month: 4, year: 2026 },
  { date: "2026-04-05", day: "Sunday", nakshatra: "Uttara Phalguni", tithi: "Krishna Tritiya", timing: "9:30 AM - 3:30 PM", rating: 4, notes: "", month: 4, year: 2026 },
  { date: "2026-04-10", day: "Friday", nakshatra: "Swati", tithi: "Krishna Ashtami", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 4, year: 2026 },
  { date: "2026-04-15", day: "Wednesday", nakshatra: "Mula", tithi: "Krishna Trayodashi", timing: "8:00 AM - 2:00 PM", rating: 4, notes: "", month: 4, year: 2026 },
  { date: "2026-04-18", day: "Saturday", nakshatra: "Shravana", tithi: "Amavasya", timing: "7:00 AM - 12:00 PM", rating: 3, notes: "", month: 4, year: 2026 },
  { date: "2026-04-22", day: "Wednesday", nakshatra: "Revati", tithi: "Shukla Chaturthi", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 4, year: 2026 },
  { date: "2026-04-25", day: "Saturday", nakshatra: "Rohini", tithi: "Shukla Saptami", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Rohini Nakshatra", month: 4, year: 2026 },
  { date: "2026-04-28", day: "Tuesday", nakshatra: "Punarvasu", tithi: "Shukla Dashami", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 4, year: 2026 },
  
  // May 2026 (Peak Season)
  { date: "2026-05-01", day: "Friday", nakshatra: "Pushya", tithi: "Shukla Trayodashi", timing: "8:30 AM - 2:30 PM", rating: 5, notes: "Akshaya Tritiya Period", month: 5, year: 2026 },
  { date: "2026-05-03", day: "Sunday", nakshatra: "Magha", tithi: "Purnima", timing: "7:30 AM - 1:30 PM", rating: 5, notes: "Buddha Purnima", month: 5, year: 2026 },
  { date: "2026-05-06", day: "Wednesday", nakshatra: "Chitra", tithi: "Krishna Tritiya", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 5, year: 2026 },
  { date: "2026-05-10", day: "Sunday", nakshatra: "Vishakha", tithi: "Krishna Saptami", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 5, year: 2026 },
  { date: "2026-05-14", day: "Thursday", nakshatra: "Jyeshtha", tithi: "Krishna Ekadashi", timing: "8:00 AM - 2:00 PM", rating: 4, notes: "", month: 5, year: 2026 },
  { date: "2026-05-17", day: "Sunday", nakshatra: "Uttara Ashadha", tithi: "Amavasya", timing: "6:30 AM - 11:30 AM", rating: 3, notes: "", month: 5, year: 2026 },
  { date: "2026-05-21", day: "Thursday", nakshatra: "Uttara Bhadrapada", tithi: "Shukla Chaturthi", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 5, year: 2026 },
  { date: "2026-05-24", day: "Sunday", nakshatra: "Ashwini", tithi: "Shukla Saptami", timing: "8:00 AM - 2:00 PM", rating: 4, notes: "", month: 5, year: 2026 },
  { date: "2026-05-27", day: "Wednesday", nakshatra: "Rohini", tithi: "Shukla Dashami", timing: "7:30 AM - 1:30 PM", rating: 5, notes: "Rohini - Most Auspicious", month: 5, year: 2026 },
  { date: "2026-05-30", day: "Saturday", nakshatra: "Punarvasu", tithi: "Shukla Trayodashi", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 5, year: 2026 },
  
  // June 2026
  { date: "2026-06-01", day: "Monday", nakshatra: "Pushya", tithi: "Purnima", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Vat Purnima", month: 6, year: 2026 },
  { date: "2026-06-05", day: "Friday", nakshatra: "Hasta", tithi: "Krishna Chaturthi", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 6, year: 2026 },
  { date: "2026-06-10", day: "Wednesday", nakshatra: "Anuradha", tithi: "Krishna Navami", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 6, year: 2026 },
  { date: "2026-06-14", day: "Sunday", nakshatra: "Purva Ashadha", tithi: "Krishna Trayodashi", timing: "8:00 AM - 2:00 PM", rating: 4, notes: "", month: 6, year: 2026 },
  { date: "2026-06-16", day: "Tuesday", nakshatra: "Shravana", tithi: "Amavasya", timing: "6:30 AM - 11:30 AM", rating: 3, notes: "", month: 6, year: 2026 },
  { date: "2026-06-21", day: "Sunday", nakshatra: "Revati", tithi: "Shukla Panchami", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 6, year: 2026 },
  { date: "2026-06-25", day: "Thursday", nakshatra: "Rohini", tithi: "Shukla Navami", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Rohini Nakshatra", month: 6, year: 2026 },
  { date: "2026-06-28", day: "Sunday", nakshatra: "Punarvasu", tithi: "Shukla Dwadashi", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 6, year: 2026 },
  
  // July 2026 (Sawan - Limited)
  { date: "2026-07-01", day: "Wednesday", nakshatra: "Ashlesha", tithi: "Purnima", timing: "7:30 AM - 1:30 PM", rating: 4, notes: "Guru Purnima", month: 7, year: 2026 },
  { date: "2026-07-05", day: "Sunday", nakshatra: "Uttara Phalguni", tithi: "Krishna Chaturthi", timing: "9:00 AM - 3:00 PM", rating: 3, notes: "Before Sawan", month: 7, year: 2026 },
  { date: "2026-07-12", day: "Sunday", nakshatra: "Jyeshtha", tithi: "Krishna Ekadashi", timing: "8:00 AM - 2:00 PM", rating: 3, notes: "", month: 7, year: 2026 },
  
  // August 2026 (Shravan - Limited)
  { date: "2026-08-08", day: "Saturday", nakshatra: "Pushya", tithi: "Purnima", timing: "7:30 AM - 12:30 PM", rating: 4, notes: "Raksha Bandhan", month: 8, year: 2026 },
  { date: "2026-08-14", day: "Friday", nakshatra: "Chitra", tithi: "Krishna Ashtami", timing: "9:00 AM - 2:00 PM", rating: 5, notes: "Krishna Janmashtami", month: 8, year: 2026 },
  { date: "2026-08-22", day: "Saturday", nakshatra: "Shravana", tithi: "Shukla Chaturthi", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "Ganesh Chaturthi", month: 8, year: 2026 },
  
  // September 2026
  { date: "2026-09-06", day: "Sunday", nakshatra: "Ashlesha", tithi: "Purnima", timing: "8:00 AM - 2:00 PM", rating: 4, notes: "", month: 9, year: 2026 },
  { date: "2026-09-12", day: "Saturday", nakshatra: "Vishakha", tithi: "Krishna Saptami", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 9, year: 2026 },
  { date: "2026-09-17", day: "Thursday", nakshatra: "Purva Ashadha", tithi: "Krishna Dwadashi", timing: "8:00 AM - 2:00 PM", rating: 4, notes: "", month: 9, year: 2026 },
  { date: "2026-09-21", day: "Monday", nakshatra: "Dhanishta", tithi: "Amavasya", timing: "6:30 AM - 11:30 AM", rating: 3, notes: "Navratri Begins", month: 9, year: 2026 },
  { date: "2026-09-25", day: "Friday", nakshatra: "Ashwini", tithi: "Shukla Chaturthi", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 9, year: 2026 },
  { date: "2026-09-28", day: "Monday", nakshatra: "Rohini", tithi: "Shukla Saptami", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Durga Saptami", month: 9, year: 2026 },
  { date: "2026-09-29", day: "Tuesday", nakshatra: "Mrigashira", tithi: "Shukla Ashtami", timing: "7:30 AM - 1:30 PM", rating: 5, notes: "Durga Ashtami", month: 9, year: 2026 },
  
  // October 2026 (Navratri & Diwali)
  { date: "2026-10-01", day: "Thursday", nakshatra: "Punarvasu", tithi: "Shukla Dashami", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Dussehra - Very Auspicious!", month: 10, year: 2026 },
  { date: "2026-10-05", day: "Monday", nakshatra: "Magha", tithi: "Purnima", timing: "9:00 AM - 3:00 PM", rating: 5, notes: "Sharad Purnima", month: 10, year: 2026 },
  { date: "2026-10-12", day: "Monday", nakshatra: "Swati", tithi: "Krishna Saptami", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 10, year: 2026 },
  { date: "2026-10-18", day: "Sunday", nakshatra: "Mula", tithi: "Krishna Trayodashi", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Dhanteras", month: 10, year: 2026 },
  { date: "2026-10-20", day: "Tuesday", nakshatra: "Uttara Ashadha", tithi: "Amavasya", timing: "7:00 AM - 12:00 PM", rating: 5, notes: "Diwali - Lakshmi Puja", month: 10, year: 2026 },
  { date: "2026-10-25", day: "Sunday", nakshatra: "Uttara Bhadrapada", tithi: "Shukla Panchami", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 10, year: 2026 },
  { date: "2026-10-29", day: "Thursday", nakshatra: "Bharani", tithi: "Shukla Navami", timing: "8:30 AM - 2:30 PM", rating: 4, notes: "", month: 10, year: 2026 },
  
  // November 2026 (Peak Season)
  { date: "2026-11-01", day: "Sunday", nakshatra: "Rohini", tithi: "Shukla Ekadashi", timing: "7:30 AM - 1:30 PM", rating: 5, notes: "Dev Uthani Ekadashi - Best Day!", month: 11, year: 2026 },
  { date: "2026-11-03", day: "Tuesday", nakshatra: "Punarvasu", tithi: "Shukla Trayodashi", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 11, year: 2026 },
  { date: "2026-11-05", day: "Thursday", nakshatra: "Pushya", tithi: "Purnima", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Kartik Purnima", month: 11, year: 2026 },
  { date: "2026-11-08", day: "Sunday", nakshatra: "Uttara Phalguni", tithi: "Krishna Tritiya", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 11, year: 2026 },
  { date: "2026-11-12", day: "Thursday", nakshatra: "Vishakha", tithi: "Krishna Saptami", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 11, year: 2026 },
  { date: "2026-11-15", day: "Sunday", nakshatra: "Anuradha", tithi: "Krishna Dashami", timing: "8:30 AM - 2:30 PM", rating: 4, notes: "", month: 11, year: 2026 },
  { date: "2026-11-19", day: "Thursday", nakshatra: "Shravana", tithi: "Amavasya", timing: "7:00 AM - 11:00 AM", rating: 3, notes: "", month: 11, year: 2026 },
  { date: "2026-11-22", day: "Sunday", nakshatra: "Shatabhisha", tithi: "Shukla Tritiya", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 11, year: 2026 },
  { date: "2026-11-25", day: "Wednesday", nakshatra: "Ashwini", tithi: "Shukla Shashthi", timing: "8:00 AM - 2:00 PM", rating: 4, notes: "", month: 11, year: 2026 },
  { date: "2026-11-27", day: "Friday", nakshatra: "Rohini", tithi: "Shukla Ashtami", timing: "7:30 AM - 1:30 PM", rating: 5, notes: "Rohini + Friday - Excellent!", month: 11, year: 2026 },
  { date: "2026-11-29", day: "Sunday", nakshatra: "Mrigashira", tithi: "Shukla Dashami", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 11, year: 2026 },
  
  // December 2026 (Peak Season)
  { date: "2026-12-03", day: "Thursday", nakshatra: "Punarvasu", tithi: "Shukla Trayodashi", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 12, year: 2026 },
  { date: "2026-12-05", day: "Saturday", nakshatra: "Pushya", tithi: "Purnima", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Margashirsha Purnima", month: 12, year: 2026 },
  { date: "2026-12-08", day: "Tuesday", nakshatra: "Uttara Phalguni", tithi: "Krishna Tritiya", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 12, year: 2026 },
  { date: "2026-12-11", day: "Friday", nakshatra: "Chitra", tithi: "Krishna Shashthi", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "Friday - Great for weddings", month: 12, year: 2026 },
  { date: "2026-12-14", day: "Monday", nakshatra: "Swati", tithi: "Krishna Navami", timing: "8:30 AM - 2:30 PM", rating: 4, notes: "", month: 12, year: 2026 },
  { date: "2026-12-18", day: "Friday", nakshatra: "Mula", tithi: "Krishna Trayodashi", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 12, year: 2026 },
  { date: "2026-12-20", day: "Sunday", nakshatra: "Uttara Ashadha", tithi: "Amavasya", timing: "7:00 AM - 12:00 PM", rating: 3, notes: "", month: 12, year: 2026 },
  { date: "2026-12-23", day: "Wednesday", nakshatra: "Shatabhisha", tithi: "Shukla Tritiya", timing: "9:00 AM - 3:00 PM", rating: 4, notes: "", month: 12, year: 2026 },
  { date: "2026-12-25", day: "Friday", nakshatra: "Uttara Bhadrapada", tithi: "Shukla Panchami", timing: "8:00 AM - 2:00 PM", rating: 4, notes: "Christmas - Modern couples", month: 12, year: 2026 },
  { date: "2026-12-27", day: "Sunday", nakshatra: "Ashwini", tithi: "Shukla Saptami", timing: "10:00 AM - 4:00 PM", rating: 4, notes: "", month: 12, year: 2026 },
  { date: "2026-12-30", day: "Wednesday", nakshatra: "Rohini", tithi: "Shukla Dashami", timing: "8:00 AM - 2:00 PM", rating: 5, notes: "Rohini - New Year Week!", month: 12, year: 2026 },
];

export const ALL_MUHURATS = [...MUHURAT_2025, ...MUHURAT_2026];

export const MONTHS_2025 = [
  { value: 1, label: "January", muhuratCount: 8, year: 2025 },
  { value: 2, label: "February", muhuratCount: 12, year: 2025, highlight: true },
  { value: 3, label: "March", muhuratCount: 8, year: 2025 },
  { value: 4, label: "April", muhuratCount: 8, year: 2025 },
  { value: 5, label: "May", muhuratCount: 10, year: 2025, highlight: true },
  { value: 6, label: "June", muhuratCount: 7, year: 2025 },
  { value: 7, label: "July", muhuratCount: 3, year: 2025, warning: "Sawan Month" },
  { value: 8, label: "August", muhuratCount: 3, year: 2025, warning: "Shravan Month" },
  { value: 9, label: "September", muhuratCount: 5, year: 2025 },
  { value: 10, label: "October", muhuratCount: 7, year: 2025 },
  { value: 11, label: "November", muhuratCount: 11, year: 2025, highlight: true },
  { value: 12, label: "December", muhuratCount: 11, year: 2025, highlight: true },
];

export const MONTHS_2026 = [
  { value: 1, label: "January", muhuratCount: 9, year: 2026 },
  { value: 2, label: "February", muhuratCount: 10, year: 2026, highlight: true },
  { value: 3, label: "March", muhuratCount: 9, year: 2026 },
  { value: 4, label: "April", muhuratCount: 8, year: 2026 },
  { value: 5, label: "May", muhuratCount: 10, year: 2026, highlight: true },
  { value: 6, label: "June", muhuratCount: 8, year: 2026 },
  { value: 7, label: "July", muhuratCount: 3, year: 2026, warning: "Sawan Month" },
  { value: 8, label: "August", muhuratCount: 3, year: 2026, warning: "Shravan Month" },
  { value: 9, label: "September", muhuratCount: 7, year: 2026 },
  { value: 10, label: "October", muhuratCount: 7, year: 2026 },
  { value: 11, label: "November", muhuratCount: 11, year: 2026, highlight: true },
  { value: 12, label: "December", muhuratCount: 10, year: 2026, highlight: true },
];

// Backwards compatibility
export const MONTHS = MONTHS_2025;
