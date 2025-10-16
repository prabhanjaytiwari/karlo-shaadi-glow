import jsPDF from 'jspdf';

interface ReceiptData {
  bookingId: string;
  vendorName: string;
  customerName: string;
  customerEmail: string;
  weddingDate: string;
  totalAmount: number;
  paidAmount: number;
  paymentDate: string;
  transactionId: string;
}

export const generateReceipt = (data: ReceiptData): jsPDF => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(24);
  doc.setTextColor(220, 38, 38); // red-600
  doc.text('Karlo Shaadi', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Payment Receipt', 105, 28, { align: 'center' });
  
  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 35, 190, 35);
  
  // Receipt details
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  let yPos = 50;
  
  doc.text('Receipt Details:', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.text(`Transaction ID: ${data.transactionId}`, 20, yPos);
  yPos += 7;
  doc.text(`Date: ${data.paymentDate}`, 20, yPos);
  yPos += 7;
  doc.text(`Booking ID: ${data.bookingId}`, 20, yPos);
  yPos += 15;
  
  // Customer details
  doc.setFontSize(12);
  doc.text('Customer Information:', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.text(`Name: ${data.customerName}`, 20, yPos);
  yPos += 7;
  doc.text(`Email: ${data.customerEmail}`, 20, yPos);
  yPos += 15;
  
  // Vendor details
  doc.setFontSize(12);
  doc.text('Vendor Information:', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.text(`Business Name: ${data.vendorName}`, 20, yPos);
  yPos += 7;
  doc.text(`Wedding Date: ${data.weddingDate}`, 20, yPos);
  yPos += 15;
  
  // Payment details
  doc.setFontSize(12);
  doc.text('Payment Summary:', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.text(`Total Booking Amount: ₹${data.totalAmount.toLocaleString('en-IN')}`, 20, yPos);
  yPos += 7;
  doc.setFont(undefined, 'bold');
  doc.text(`Amount Paid: ₹${data.paidAmount.toLocaleString('en-IN')}`, 20, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 7;
  doc.text(`Balance Due: ₹${(data.totalAmount - data.paidAmount).toLocaleString('en-IN')}`, 20, yPos);
  
  // Footer
  yPos = 270;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('This is a computer-generated receipt and does not require a signature.', 105, yPos, { align: 'center' });
  doc.text('For any queries, please contact support@karloshaadi.com', 105, yPos + 5, { align: 'center' });
  
  return doc;
};

export const downloadReceipt = (data: ReceiptData) => {
  const doc = generateReceipt(data);
  doc.save(`Receipt_${data.bookingId}_${Date.now()}.pdf`);
};
