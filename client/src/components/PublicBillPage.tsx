// src/components/PublicBillPage.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// We reuse the existing ShippingBill component for the layout
import ShippingBill from './ShippingBill';
// Assuming you have a function to fetch a single order
import { fetchSingleOrder } from '../services/api'; 

// Re-defining the Order type here for clarity
interface Order {
  _id: string;
  orderNumber: string;
  user: { name: string; email: string; phone: string; address: string; };
  items: { title: string; price: number; size: string; quantity: number; }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const PublicBillPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // A ref to the hidden bill component that we will convert to PDF
  const billRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!orderNumber) return;

    const getOrderAndGeneratePdf = async () => {
      try {
        setLoading(true);
        // You'll need an API function like this to get one order
        const fetchedOrder = await fetchSingleOrder(orderNumber);
        setOrder(fetchedOrder);
      } catch (err) {
        setError('Could not find the order. Please check the link.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getOrderAndGeneratePdf();
  }, [orderNumber]);

  // This useEffect triggers the PDF download once the order data is loaded
  useEffect(() => {
    if (order && billRef.current) {
      const billElement = billRef.current;
      
      html2canvas(billElement, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        
        // A4 page dimensions in mm: 210mm wide, 297mm tall
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const canvasRatio = canvasHeight / canvasWidth;
        
        const finalPdfWidth = pdfWidth - 20; // A4 width with 10mm margin on each side
        const finalPdfHeight = finalPdfWidth * canvasRatio;

        pdf.addImage(imgData, 'PNG', 10, 10, finalPdfWidth, finalPdfHeight);
        pdf.save(`Nifti-Bill-${order.orderNumber}.pdf`);
      });
    }
  }, [order]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading and generating your bill...</div>;
  }

  if (error) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  return (
    <>
      {/* This message is shown on screen to the user */}
      <div style={{ padding: '40px', textAlign: 'center' }}>
        Your PDF download should start automatically.
      </div>
      
      {/* This is the actual bill component. We render it off-screen to take its picture. */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        {order && (
          <div ref={billRef} style={{ width: '800px', background: 'white' }}>
            {/* We pass a dummy onClose function because it's not needed here */}
            <ShippingBill order={order} onClose={() => {}} />
          </div>
        )}
      </div>
    </>
  );
};

export default PublicBillPage;