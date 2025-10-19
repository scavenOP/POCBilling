import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingService, Product, BillItem, Bill, ValidationErrors } from '../../services/billing.service';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-new-bill',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-bill.component.html',
  styleUrls: ['./new-bill.component.scss']
})
export class NewBillComponent implements OnInit {
  products: Product[] = [];
  billItems: BillItem[] = [];
  selectedProduct: Product | null = null;
  quantity: number = 1;
  customerName: string = '';
  customerPhone: string = '';
  
  subtotal: number = 0;
  totalCgst: number = 0;
  totalSgst: number = 0;
  grandTotal: number = 0;
  
  validationErrors: ValidationErrors = {};
  isFormValid: boolean = false;

  constructor(
    private billingService: BillingService,
    private shopService: ShopService
  ) {}

  ngOnInit() {
    this.products = this.billingService.getProducts();
  }

  addItem() {
    this.validateForm();
    if (this.isFormValid && this.selectedProduct && this.quantity > 0) {
      const billItem = this.billingService.calculateBillItem(this.selectedProduct, this.quantity);
      this.billItems.push(billItem);
      this.calculateTotals();
      this.resetForm();
    }
  }

  removeItem(index: number) {
    this.billItems.splice(index, 1);
    this.calculateTotals();
  }

  calculateTotals() {
    this.subtotal = this.billItems.reduce((sum, item) => sum + item.taxableValue, 0);
    this.totalCgst = this.billItems.reduce((sum, item) => sum + item.cgst, 0);
    this.totalSgst = this.billItems.reduce((sum, item) => sum + item.sgst, 0);
    this.grandTotal = this.billItems.reduce((sum, item) => sum + item.total, 0);
  }

  resetForm() {
    this.selectedProduct = null;
    this.quantity = 1;
  }

  clearBill() {
    if (confirm('Are you sure you want to clear the entire bill?')) {
      this.resetBill();
    }
  }

  saveBill() {
    this.validateCustomerInfo();
    if (!this.isFormValid) {
      alert('Please fill in all required customer information');
      return;
    }
    
    if (this.billItems.length === 0) {
      alert('Please add at least one item to the bill');
      return;
    }

    const bill: Bill = {
      id: this.billingService.generateBillId(),
      date: new Date(),
      items: this.billItems,
      subtotal: this.subtotal,
      totalCgst: this.totalCgst,
      totalSgst: this.totalSgst,
      grandTotal: this.grandTotal,
      customerName: this.customerName,
      customerPhone: this.customerPhone
    };

    const bills = JSON.parse(localStorage.getItem('bills') || '[]');
    bills.push(bill);
    localStorage.setItem('bills', JSON.stringify(bills));

    alert('Bill saved successfully!');
    
    if (confirm('Do you want to print the bill now?')) {
      this.printBill(bill);
    }
    
    if (confirm('Do you want to create a new bill?')) {
      this.resetBill();
    }
  }

  previewBill() {
    this.validateCustomerInfo();
    if (!this.isFormValid) {
      alert('Please fill in all required customer information');
      return;
    }
    
    if (this.billItems.length === 0) {
      alert('Please add at least one item to preview the bill');
      return;
    }

    const bill: Bill = {
      id: 'PREVIEW-' + Date.now(),
      date: new Date(),
      items: this.billItems,
      subtotal: this.subtotal,
      totalCgst: this.totalCgst,
      totalSgst: this.totalSgst,
      grandTotal: this.grandTotal,
      customerName: this.customerName,
      customerPhone: this.customerPhone
    };

    this.showBillPreview(bill);
  }

  showBillPreview(bill: Bill) {
    const shopSettings = this.shopService.getSettings();
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (previewWindow) {
      previewWindow.document.write(this.generateBillHTML(bill, shopSettings, true));
      previewWindow.document.close();
    }
  }

  printBill(bill: Bill) {
    const shopSettings = this.shopService.getSettings();
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(this.generateBillHTML(bill, shopSettings));
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
      }, 2000);
    }
  }

  resetBill() {
    this.billItems = [];
    this.customerName = '';
    this.customerPhone = '';
    this.selectedProduct = null;
    this.quantity = 1;
    this.validationErrors = {};
    this.isFormValid = false;
    this.calculateTotals();
  }

  validateCustomerInfo() {
    this.validationErrors = {};
    
    if (!this.customerName || this.customerName.trim().length < 2) {
      this.validationErrors.customerName = 'Customer name is required (minimum 2 characters)';
    }
    
    if (!this.customerPhone || !/^[6-9]\d{9}$/.test(this.customerPhone)) {
      this.validationErrors.customerPhone = 'Valid 10-digit mobile number is required';
    }
    
    this.isFormValid = Object.keys(this.validationErrors).length === 0;
  }

  validateForm() {
    this.validateCustomerInfo();
    
    if (!this.selectedProduct) {
      this.validationErrors.product = 'Please select a product';
    }
    
    if (!this.quantity || this.quantity < 1) {
      this.validationErrors.quantity = 'Quantity must be at least 1';
    }
    
    this.isFormValid = Object.keys(this.validationErrors).length === 0;
  }

  onCustomerNameChange() {
    if (this.customerName) {
      delete this.validationErrors.customerName;
    }
  }

  onCustomerPhoneChange() {
    if (this.customerPhone) {
      delete this.validationErrors.customerPhone;
    }
  }

  onProductChange() {
    if (this.selectedProduct) {
      delete this.validationErrors.product;
    }
  }

  onQuantityChange() {
    if (this.quantity && this.quantity > 0) {
      delete this.validationErrors.quantity;
    }
  }

  private generateBillHTML(bill: Bill, shopSettings: any, isPreview: boolean = false): string {
    switch (shopSettings.billFormat) {
      case 'compact':
        return this.generateCompactBill(bill, shopSettings, isPreview);
      case 'detailed':
        return this.generateDetailedBill(bill, shopSettings, isPreview);
      case 'minimal':
        return this.generateMinimalBill(bill, shopSettings, isPreview);
      default:
        return this.generateStandardBill(bill, shopSettings, isPreview);
    }
  }

  private generateStandardBill(bill: Bill, shopSettings: any, isPreview: boolean = false): string {
    const upiPaymentString = shopSettings.upiId ? 
      `upi://pay?pa=${shopSettings.upiId}&pn=${encodeURIComponent(shopSettings.shopName)}&am=${bill.grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Bill Payment - ' + bill.id)}` : '';
    
    const upiQrUrl = shopSettings.upiId ? 
      `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiPaymentString)}` : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tax Invoice - ${bill.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; font-size: 12px; }
          .invoice { max-width: 800px; margin: 0 auto; border: 2px solid #000; }
          .header { text-align: center; padding: 10px; border-bottom: 2px solid #000; }
          .company-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
          .company-details { font-size: 11px; line-height: 1.4; }
          .invoice-title { font-size: 16px; font-weight: bold; margin: 10px 0; }
          .details-section { display: flex; border-bottom: 1px solid #000; }
          .left-details, .right-details { flex: 1; padding: 10px; }
          .right-details { border-left: 1px solid #000; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 11px; }
          th { background-color: #f0f0f0; font-weight: bold; text-align: center; }
          .amount { text-align: right; }
          .total-section { background-color: #f9f9f9; }
          .footer { padding: 10px; border-top: 1px solid #000; }
          .upi-section { text-align: center; margin-top: 10px; }
          .logo { max-height: 60px; margin-bottom: 10px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            ${shopSettings.logo && shopSettings.showLogoOnBill ? `<img src="${shopSettings.logo}" class="logo" alt="Logo">` : ''}
            <div class="company-name">${shopSettings.shopName}</div>
            <div class="company-details">
              GSTIN: ${shopSettings.gstin}<br>
              ${shopSettings.address}<br>
              Phone: ${shopSettings.phone} | Email: ${shopSettings.email}
            </div>
            <div class="invoice-title">TAX INVOICE</div>
          </div>

          <div class="details-section">
            <div class="left-details">
              <strong>Bill To:</strong><br>
              ${bill.customerName}<br>
              Phone: ${bill.customerPhone}
            </div>
            <div class="right-details">
              <strong>Invoice No:</strong> ${bill.id}<br>
              <strong>Date:</strong> ${bill.date.toLocaleDateString('en-IN')}<br>
              <strong>Time:</strong> ${bill.date.toLocaleTimeString('en-IN')}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Description</th>
                <th>HSN Code</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Taxable Value</th>
                <th>CGST %</th>
                <th>CGST ₹</th>
                <th>SGST %</th>
                <th>SGST ₹</th>
                <th>Amount ₹</th>
              </tr>
            </thead>
            <tbody>
              ${bill.items.map((item, index) => `
                <tr>
                  <td style="text-align: center;">${index + 1}</td>
                  <td>${item.product.name}</td>
                  <td style="text-align: center;">${item.product.hsnCode}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td class="amount">₹${item.product.price.toLocaleString('en-IN')}</td>
                  <td class="amount">₹${item.taxableValue.toFixed(2)}</td>
                  <td style="text-align: center;">${(item.product.gstRate / 2).toFixed(1)}%</td>
                  <td class="amount">₹${item.cgst.toFixed(2)}</td>
                  <td style="text-align: center;">${(item.product.gstRate / 2).toFixed(1)}%</td>
                  <td class="amount">₹${item.sgst.toFixed(2)}</td>
                  <td class="amount">₹${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-section">
                <td colspan="5" style="text-align: right; font-weight: bold;">Total</td>
                <td class="amount"><strong>₹${bill.subtotal.toFixed(2)}</strong></td>
                <td></td>
                <td class="amount"><strong>₹${bill.totalCgst.toFixed(2)}</strong></td>
                <td></td>
                <td class="amount"><strong>₹${bill.totalSgst.toFixed(2)}</strong></td>
                <td class="amount"><strong>₹${bill.grandTotal.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>Amount in Words:</strong> ${this.numberToWords(bill.grandTotal)} Rupees Only
              </div>
              ${shopSettings.upiId && shopSettings.showUpiOnBill ? `
                <div class="upi-section">
                  <div><strong>Pay via UPI</strong></div>
                  <img src="${upiQrUrl}" alt="UPI QR Code" style="margin-top: 5px; border: 1px solid #ddd; padding: 5px;" onload="this.style.border='1px solid #28a745'" onerror="this.style.border='1px solid #dc3545'; this.alt='QR Code Error';">
                  <div style="font-size: 10px; margin-top: 5px;">${shopSettings.upiId}</div>
                </div>
              ` : ''}
            </div>
            ${isPreview ? `
              <div style="text-align: center; margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                <strong>PREVIEW MODE</strong> - This is a preview of your bill
              </div>
            ` : ''}
            <div style="text-align: right; margin-top: 20px;">
              <div>For ${shopSettings.shopName}</div>
              <div style="margin-top: 40px; border-top: 1px solid #000; padding-top: 5px; width: 200px; margin-left: auto;">
                Authorized Signatory
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private numberToWords(num: number): string {
    if (num === 0) return 'Zero';
    
    const integerPart = Math.floor(num);
    let result = '';
    
    if (integerPart >= 10000000) {
      const crores = Math.floor(integerPart / 10000000);
      result += this.convertGroup(crores) + ' Crore ';
    }
    
    const remainder1 = integerPart % 10000000;
    if (remainder1 >= 100000) {
      const lakhs = Math.floor(remainder1 / 100000);
      result += this.convertGroup(lakhs) + ' Lakh ';
    }
    
    const remainder2 = remainder1 % 100000;
    if (remainder2 >= 1000) {
      const thousands = Math.floor(remainder2 / 1000);
      result += this.convertGroup(thousands) + ' Thousand ';
    }
    
    const remainder3 = remainder2 % 1000;
    if (remainder3 > 0) {
      result += this.convertGroup(remainder3);
    }
    
    return result.trim();
  }
  
  private convertGroup(num: number): string {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    let result = '';
    
    if (num >= 100) {
      result += ones[Math.floor(num / 100)] + ' Hundred';
      num %= 100;
      if (num > 0) result += ' ';
    }
    
    if (num >= 20) {
      result += tens[Math.floor(num / 10)];
      num %= 10;
      if (num > 0) result += ' ' + ones[num];
    } else if (num >= 10) {
      result += teens[num - 10];
    } else if (num > 0) {
      result += ones[num];
    }
    
    return result;
  }

  private generateCompactBill(bill: Bill, shopSettings: any, isPreview: boolean = false): string {
    const upiPaymentString = shopSettings.upiId ? 
      `upi://pay?pa=${shopSettings.upiId}&pn=${encodeURIComponent(shopSettings.shopName)}&am=${bill.grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Bill Payment - ' + bill.id)}` : '';
    
    const upiQrUrl = shopSettings.upiId ? 
      `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(upiPaymentString)}` : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${bill.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 10px; font-size: 11px; }
          .invoice { max-width: 600px; margin: 0 auto; border: 1px solid #000; }
          .header { text-align: center; padding: 8px; border-bottom: 1px solid #000; }
          .company-name { font-size: 14px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 4px; font-size: 10px; }
          th { background-color: #f0f0f0; }
          .footer { padding: 8px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div class="company-name">${shopSettings.shopName}</div>
            <div>Ph: ${shopSettings.phone} | GSTIN: ${shopSettings.gstin}</div>
            <div>Bill: ${bill.id} | Date: ${bill.date.toLocaleDateString('en-IN')}</div>
            <div>Customer: ${bill.customerName} | Ph: ${bill.customerPhone}</div>
          </div>
          <table>
            <tr><th>Item</th><th>Qty</th><th>Rate</th><th>GST</th><th>Total</th></tr>
            ${bill.items.map(item => `
              <tr>
                <td>${item.product.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.product.price}</td>
                <td>${item.product.gstRate}%</td>
                <td>₹${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr style="font-weight: bold;"><td colspan="4">Grand Total</td><td>₹${bill.grandTotal.toFixed(2)}</td></tr>
          </table>
          <div class="footer">
            ${shopSettings.upiId && shopSettings.showUpiOnBill ? `<img src="${upiQrUrl}" alt="UPI QR">` : ''}
            <div>Thank you for your business!</div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateDetailedBill(bill: Bill, shopSettings: any, isPreview: boolean = false): string {
    const upiPaymentString = shopSettings.upiId ? 
      `upi://pay?pa=${shopSettings.upiId}&pn=${encodeURIComponent(shopSettings.shopName)}&am=${bill.grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Bill Payment - ' + bill.id)}` : '';
    
    const upiQrUrl = shopSettings.upiId ? 
      `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiPaymentString)}` : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Detailed Tax Invoice - ${bill.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 15px; font-size: 12px; }
          .invoice { max-width: 900px; margin: 0 auto; border: 3px solid #000; }
          .header { text-align: center; padding: 15px; border-bottom: 2px solid #000; background: #f9f9f9; }
          .company-name { font-size: 22px; font-weight: bold; color: #2c3e50; }
          .section { padding: 10px; border-bottom: 1px solid #ccc; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #000; padding: 10px; }
          th { background-color: #34495e; color: white; }
          .summary { background: #ecf0f1; padding: 15px; }
          .terms { font-size: 10px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            ${shopSettings.logo && shopSettings.showLogoOnBill ? `<img src="${shopSettings.logo}" style="max-height: 80px; margin-bottom: 10px;" alt="Logo">` : ''}
            <div class="company-name">${shopSettings.shopName}</div>
            <div style="margin: 10px 0;">${shopSettings.address}</div>
            <div>Phone: ${shopSettings.phone} | Email: ${shopSettings.email}</div>
            <div style="font-weight: bold; margin-top: 10px;">GSTIN: ${shopSettings.gstin}</div>
            <div style="font-size: 18px; font-weight: bold; margin-top: 10px; color: #e74c3c;">DETAILED TAX INVOICE</div>
          </div>
          
          <div class="section">
            <div style="display: flex; justify-content: space-between;">
              <div>
                <strong>Bill To:</strong><br>
                ${bill.customerName}<br>
                Phone: ${bill.customerPhone}
              </div>
              <div style="text-align: right;">
                <strong>Invoice Details:</strong><br>
                Invoice No: ${bill.id}<br>
                Date: ${bill.date.toLocaleDateString('en-IN')}<br>
                Time: ${bill.date.toLocaleTimeString('en-IN')}
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Product Description</th>
                <th>HSN/SAC</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Discount</th>
                <th>Taxable Value</th>
                <th>CGST Rate</th>
                <th>CGST Amount</th>
                <th>SGST Rate</th>
                <th>SGST Amount</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              ${bill.items.map((item, index) => `
                <tr>
                  <td style="text-align: center;">${index + 1}</td>
                  <td>${item.product.name}<br><small>${item.product.category}</small></td>
                  <td style="text-align: center;">${item.product.hsnCode}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">₹${item.product.price.toLocaleString('en-IN')}</td>
                  <td style="text-align: right;">₹0.00</td>
                  <td style="text-align: right;">₹${item.taxableValue.toFixed(2)}</td>
                  <td style="text-align: center;">${(item.product.gstRate / 2).toFixed(1)}%</td>
                  <td style="text-align: right;">₹${item.cgst.toFixed(2)}</td>
                  <td style="text-align: center;">${(item.product.gstRate / 2).toFixed(1)}%</td>
                  <td style="text-align: right;">₹${item.sgst.toFixed(2)}</td>
                  <td style="text-align: right;">₹${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background: #34495e; color: white; font-weight: bold;">
                <td colspan="6" style="text-align: right;">TOTAL</td>
                <td style="text-align: right;">₹${bill.subtotal.toFixed(2)}</td>
                <td></td>
                <td style="text-align: right;">₹${bill.totalCgst.toFixed(2)}</td>
                <td></td>
                <td style="text-align: right;">₹${bill.totalSgst.toFixed(2)}</td>
                <td style="text-align: right;">₹${bill.grandTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div class="summary">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>Amount in Words:</strong><br>
                ${this.numberToWords(bill.grandTotal)} Rupees Only
              </div>
              ${shopSettings.upiId && shopSettings.showUpiOnBill ? `
                <div style="text-align: center;">
                  <div><strong>Scan & Pay</strong></div>
                  <img src="${upiQrUrl}" alt="UPI QR Code" style="margin: 10px;">
                  <div style="font-size: 10px;">${shopSettings.upiId}</div>
                </div>
              ` : ''}
            </div>
            
            <div class="terms">
              <strong>Terms & Conditions:</strong><br>
              1. Goods once sold will not be taken back.<br>
              2. All disputes are subject to local jurisdiction.<br>
              3. Payment due within 30 days of invoice date.
            </div>
            
            <div style="text-align: right; margin-top: 30px;">
              <div>For ${shopSettings.shopName}</div>
              <div style="margin-top: 50px; border-top: 1px solid #000; padding-top: 5px; width: 200px; margin-left: auto;">
                Authorized Signatory
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateMinimalBill(bill: Bill, shopSettings: any, isPreview: boolean = false): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${bill.id}</title>
        <style>
          body { font-family: monospace; margin: 0; padding: 5px; font-size: 10px; }
          .receipt { max-width: 300px; margin: 0 auto; }
          .center { text-align: center; }
          .line { border-bottom: 1px dashed #000; margin: 5px 0; }
          .total { font-weight: bold; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="center">
            <div style="font-weight: bold;">${shopSettings.shopName}</div>
            <div>${shopSettings.phone}</div>
            <div>GSTIN: ${shopSettings.gstin}</div>
          </div>
          <div class="line"></div>
          <div>Bill: ${bill.id}</div>
          <div>Date: ${bill.date.toLocaleDateString('en-IN')} ${bill.date.toLocaleTimeString('en-IN')}</div>
          <div>Customer: ${bill.customerName}</div>
          <div class="line"></div>
          ${bill.items.map(item => `
            <div>${item.product.name}</div>
            <div>${item.quantity} x ₹${item.product.price} = ₹${item.total.toFixed(2)}</div>
          `).join('')}
          <div class="line"></div>
          <div>Subtotal: ₹${bill.subtotal.toFixed(2)}</div>
          <div>CGST: ₹${bill.totalCgst.toFixed(2)}</div>
          <div>SGST: ₹${bill.totalSgst.toFixed(2)}</div>
          <div class="line"></div>
          <div class="total center">TOTAL: ₹${bill.grandTotal.toFixed(2)}</div>
          <div class="line"></div>
          <div class="center">Thank You!</div>
        </div>
      </body>
      </html>
    `;
  }
}