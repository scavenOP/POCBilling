import { Injectable } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  hsnCode: string;
  gstRate: number;
  price: number;
  category: string;
}

export interface BillItem {
  product: Product;
  quantity: number;
  price: number;
  taxableValue: number;
  cgst: number;
  sgst: number;
  total: number;
}

export interface ValidationErrors {
  customerName?: string;
  customerPhone?: string;
  product?: string;
  quantity?: string;
}

export interface Bill {
  id: string;
  date: Date;
  items: BillItem[];
  subtotal: number;
  totalCgst: number;
  totalSgst: number;
  grandTotal: number;
  customerName?: string;
  customerPhone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private products: Product[] = [
    { id: '1', name: 'Samsung Galaxy S24', hsnCode: '8517', gstRate: 18, price: 75000, category: 'Mobile Phone' },
    { id: '2', name: 'iPhone 15 Pro', hsnCode: '8517', gstRate: 18, price: 125000, category: 'Mobile Phone' },
    { id: '3', name: 'Dell Inspiron Laptop', hsnCode: '8471', gstRate: 18, price: 55000, category: 'Laptop' },
    { id: '4', name: 'HP Pavilion Laptop', hsnCode: '8471', gstRate: 18, price: 45000, category: 'Laptop' },
    { id: '5', name: 'Sony 55" LED TV', hsnCode: '8528', gstRate: 18, price: 65000, category: 'Television' },
    { id: '6', name: 'LG Refrigerator 190L', hsnCode: '8418', gstRate: 18, price: 25000, category: 'Appliance' },
    { id: '7', name: 'Samsung Washing Machine', hsnCode: '8450', gstRate: 18, price: 35000, category: 'Appliance' },
    { id: '8', name: 'Apple iPad Pro', hsnCode: '8471', gstRate: 18, price: 85000, category: 'Tablet' },
    { id: '9', name: 'JBL Bluetooth Speaker', hsnCode: '8518', gstRate: 18, price: 5000, category: 'Audio' },
    { id: '10', name: 'Canon DSLR Camera', hsnCode: '9006', gstRate: 18, price: 45000, category: 'Camera' }
  ];

  getProducts(): Product[] {
    return this.products;
  }

  calculateBillItem(product: Product, quantity: number): BillItem {
    const price = product.price * quantity;
    const taxableValue = price;
    const gstAmount = (taxableValue * product.gstRate) / 100;
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const total = taxableValue + gstAmount;

    return {
      product,
      quantity,
      price,
      taxableValue,
      cgst,
      sgst,
      total
    };
  }

  generateBillId(): string {
    return 'BILL-' + Date.now();
  }
}