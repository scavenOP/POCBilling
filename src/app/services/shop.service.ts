import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ShopSettings {
  shopName: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  logo?: string;
  upiId: string;
  showUpiOnBill: boolean;
  showLogoOnBill: boolean;
  billFormat: 'standard' | 'compact' | 'detailed' | 'minimal';
}

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private defaultSettings: ShopSettings = {
    shopName: 'TechWorld Electronics',
    address: '123 Electronics Plaza, Tech City, State - 123456',
    phone: '9876543210',
    email: 'info@techworld.com',
    gstin: '19ABCDE1234F1Z5',
    upiId: 'techworld@upi',
    showUpiOnBill: true,
    showLogoOnBill: true,
    billFormat: 'standard'
  };

  private settingsSubject = new BehaviorSubject<ShopSettings>(this.defaultSettings);
  public settings$ = this.settingsSubject.asObservable();

  constructor() {
    const saved = localStorage.getItem('shopSettings');
    if (saved) {
      this.settingsSubject.next(JSON.parse(saved));
    }
  }

  updateSettings(settings: ShopSettings) {
    this.settingsSubject.next(settings);
    localStorage.setItem('shopSettings', JSON.stringify(settings));
  }

  getSettings(): ShopSettings {
    return this.settingsSubject.value;
  }
}