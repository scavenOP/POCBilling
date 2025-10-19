import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService, ShopSettings } from '../../services/shop.service';

@Component({
  selector: 'app-shop-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop-settings.component.html',
  styleUrls: ['./shop-settings.component.scss']
})
export class ShopSettingsComponent implements OnInit {
  settings: ShopSettings = {
    shopName: '',
    address: '',
    phone: '',
    email: '',
    gstin: '',
    upiId: '',
    showUpiOnBill: true,
    showLogoOnBill: true,
    billFormat: 'standard'
  };

  constructor(private shopService: ShopService) {}

  ngOnInit() {
    this.settings = { ...this.shopService.getSettings() };
  }

  onLogoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.settings.logo = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveSettings() {
    this.shopService.updateSettings(this.settings);
    alert('Settings saved successfully!');
  }

  resetSettings() {
    if (confirm('Are you sure you want to reset all settings?')) {
      this.ngOnInit();
    }
  }
}