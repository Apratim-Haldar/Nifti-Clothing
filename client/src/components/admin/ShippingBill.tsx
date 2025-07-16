import React from 'react';

interface OrderItem {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  size: string;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ShippingBillProps {
  order: Order;
  onClose: () => void;
}

const ShippingBill: React.FC<ShippingBillProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Modal Overlay - Hidden during print */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ display: 'flex' }}>
        <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-auto">
          {/* Print Controls */}
          <div className="p-4 bg-gray-100 border-b no-print">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Shipping Bill - {order.orderNumber}</h3>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Bill
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Save as PDF
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* Shipping Bill Content */}
          <div className="bill-content p-6 bg-white">
            {/* Header */}
            <div className="border-4 border-black p-4 mb-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-black mb-1">NIFTI CLOTHING</h1>
                  <p className="text-sm text-gray-700">Premium Fashion Store</p>
                  <p className="text-xs text-gray-600">nifti07@gmail.com | +91 8100371049</p>
                </div>
                <div className="text-right">
                  <div className="bg-black text-white px-3 py-1 text-xs font-bold mb-1">
                    SHIPPING BILL
                  </div>
                  <p className="text-xs text-gray-600">Date: {formatDate(order.createdAt)}</p>
                  <p className="text-xs text-gray-600">Time: {formatTime(order.createdAt)}</p>
                </div>
              </div>

              {/* Order Number */}
              <div className="text-center border-2 border-dashed border-gray-400 p-2 mb-4">
                <p className="text-xs text-gray-600">ORDER NUMBER</p>
                <p className="text-2xl font-bold text-black tracking-wider">{order.orderNumber}</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Ship To */}
              <div className="border-2 border-gray-300 p-4">
                <h3 className="text-sm font-bold bg-gray-100 px-2 py-1 mb-3 border-b border-gray-300">
                  📦 SHIP TO
                </h3>
                <div className="space-y-2">
                  <p className="font-bold text-base text-black">{order.user.name.toUpperCase()}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{order.user.address}</p>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-600">📱 {order.user.phone}</p>
                    <p className="text-xs text-gray-600">✉️ {order.user.email}</p>
                  </div>
                </div>
              </div>

              {/* Ship From & Status */}
              <div className="space-y-4">
                <div className="border-2 border-gray-300 p-4">
                  <h3 className="text-sm font-bold bg-gray-100 px-2 py-1 mb-3 border-b border-gray-300">
                    🏪 SHIP FROM
                  </h3>
                  <div className="space-y-1">
                    <p className="font-bold text-sm">NIFTI CLOTHING</p>
                    <p className="text-xs text-gray-700">Fashion District, Mumbai</p>
                    <p className="text-xs text-gray-700">Maharashtra 400001</p>
                    <p className="text-xs text-gray-600">📱 +91 8100371049</p>
                  </div>
                </div>

                <div className="border-2 border-gray-300 p-4">
                  <h3 className="text-sm font-bold bg-gray-100 px-2 py-1 mb-3 border-b border-gray-300">
                    📋 ORDER STATUS
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Status:</span>
                      <span className="text-xs font-semibold text-black">{order.status.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Payment:</span>
                      <span className="text-xs font-semibold text-black">{order.paymentStatus.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Method:</span>
                      <span className="text-xs font-semibold text-black">{order.paymentMethod.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Contents */}
            <div className="border-2 border-gray-300 mb-6">
              <h3 className="text-sm font-bold bg-gray-100 px-4 py-2 border-b border-gray-300">
                📦 PACKAGE CONTENTS ({order.items.length} {order.items.length === 1 ? 'ITEM' : 'ITEMS'})
              </h3>
              <div className="p-4">
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-b-0">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-black">{item.title}</p>
                        <p className="text-xs text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-black">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t-2 border-black mt-4 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-black">TOTAL AMOUNT:</span>
                    <span className="text-lg font-bold text-black">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions & Notes */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border border-gray-300 p-3">
                <h4 className="text-xs font-bold text-gray-700 mb-2">🚚 HANDLING INSTRUCTIONS</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Handle with care</li>
                  <li>• Keep dry and away from moisture</li>
                  <li>• Do not bend or fold</li>
                  <li>• Verify contents before delivery</li>
                </ul>
              </div>
              
              {order.notes ? (
                <div className="border border-gray-300 p-3">
                  <h4 className="text-xs font-bold text-gray-700 mb-2">📝 SPECIAL NOTES</h4>
                  <p className="text-xs text-gray-600">{order.notes}</p>
                </div>
              ) : (
                <div className="border border-gray-300 p-3">
                  <h4 className="text-xs font-bold text-gray-700 mb-2">📞 CONTACT INFO</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>📧 nifti07@gmail.com</p>
                    <p>📱 +91 8100371049</p>
                    <p>🌐 www.nifti.com</p>
                  </div>
                </div>
              )}
            </div>

            {/* Signature Section */}
            <div className="border-2 border-black p-4 mb-4">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-bold text-black mb-4">📝 CUSTOMER SIGNATURE</h4>
                  <div className="border-b-2 border-gray-400 h-12 mb-2"></div>
                  <p className="text-xs text-gray-600">Customer Name & Signature</p>
                  <p className="text-xs text-gray-600 mt-1">Date: _______________</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black mb-4">🚚 DELIVERY CONFIRMATION</h4>
                  <div className="border-b-2 border-gray-400 h-12 mb-2"></div>
                  <p className="text-xs text-gray-600">Delivery Agent Signature</p>
                  <p className="text-xs text-gray-600 mt-1">Date: _______________</p>
                </div>
              </div>
            </div>

            {/* Barcode Area */}
            <div className="text-center p-3 border border-gray-300 mb-4">
              <div className="flex flex-col items-center">
                <div className="bg-black text-white px-2 py-1 text-xs font-mono tracking-widest mb-2">
                  ||||| {order.orderNumber} ||||
                </div>
                <p className="text-xs text-gray-500">Tracking Code</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-300">
              <p className="text-xs text-gray-500">
                Thank you for choosing NIFTI CLOTHING | For support: nifti07@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          
          .bill-content, .bill-content * {
            visibility: visible;
          }
          
          .bill-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0.5in;
            font-size: 12px;
          }
          
          .no-print {
            display: none !important;
          }
          
          @page {
            size: A4;
            margin: 0.5in;
          }
          
          /* Smaller text for print */
          .bill-content h1 {
            font-size: 24px !important;
          }
          
          .bill-content .text-2xl {
            font-size: 18px !important;
          }
          
          .bill-content .text-lg {
            font-size: 14px !important;
          }
          
          .bill-content .text-base {
            font-size: 12px !important;
          }
          
          .bill-content .text-sm {
            font-size: 11px !important;
          }
          
          .bill-content .text-xs {
            font-size: 10px !important;
          }
          
          .bill-content .p-4 {
            padding: 8px !important;
          }
          
          .bill-content .p-3 {
            padding: 6px !important;
          }
          
          .bill-content .mb-6 {
            margin-bottom: 12px !important;
          }
          
          .bill-content .mb-4 {
            margin-bottom: 8px !important;
          }
          
          .bill-content .gap-6 {
            gap: 12px !important;
          }
          
          .bill-content .gap-4 {
            gap: 8px !important;
          }
          
          .bill-content .h-12 {
            height: 24px !important;
          }
        }
      `}</style>
    </>
  );
};

export default ShippingBill;