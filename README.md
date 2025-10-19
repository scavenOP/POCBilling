# BillPro - Professional Billing Software POC

A comprehensive billing software built with Angular 18, designed for Indian businesses with GST compliance and UPI payment integration.

## 🚀 Features

### ✅ Implemented Features
- **New Bill Creation**: Professional invoice generation with GST calculations
- **Shop Settings**: Complete shop configuration with logo upload and UPI settings
- **GST Compliance**: Automatic CGST/SGST calculations as per Indian tax rules
- **UPI Integration**: QR code generation for seamless payments
- **Professional Bill Format**: Tax invoice format similar to standard business invoices
- **Mobile Responsive**: Optimized for mobile devices and tablets
- **Print Functionality**: Professional bill printing with proper formatting
- **Bill Preview**: Preview bills before saving and printing
- **Local Storage**: Bills and settings saved locally

### 🔄 Coming Soon Features
- **Product Management**: Add, edit, and manage product catalog
- **Customer Management**: Customer database and history
- **User Management**: Multi-user access and permissions
- **Reports & Analytics**: Sales reports and business insights
- **Data Export**: Export bills and reports to PDF/Excel

## 🛠️ Technical Stack

- **Frontend**: Angular 18 (Standalone Components)
- **Styling**: SCSS with responsive design
- **Storage**: Browser LocalStorage
- **QR Generation**: QR Server API for UPI payments
- **Print**: Browser native print functionality

## 📱 Mobile Optimized

The application is fully responsive and optimized for mobile devices, making it perfect for:
- Tablet-based POS systems
- Mobile billing on the go
- Touch-friendly interface
- Compact layouts for small screens

## 🏪 Business Features

### Shop Configuration
- Shop name, address, and contact details
- GSTIN registration number
- Logo upload and branding
- UPI ID for digital payments
- Customizable bill display options

### Billing Features
- Product selection with HSN codes
- Automatic GST calculations (5%, 12%, 18% rates)
- CGST/SGST breakdown
- Customer information capture
- Professional invoice numbering
- Amount in words conversion (Indian format)
- UPI QR code with bill amount

### Product Categories
- Food items (5% GST)
- Electronics (18% GST)
- Clothing (12% GST)
- Custom HSN codes and rates

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Angular CLI (v18 or higher)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd POCBilling
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
# or
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

### First Time Setup

1. **Configure Shop Settings**:
   - Go to Settings page
   - Enter your shop details
   - Upload logo (optional)
   - Set UPI ID for payments
   - Save settings

2. **Create Your First Bill**:
   - Go to New Bill page
   - Add customer information (optional)
   - Select products and quantities
   - Preview the bill
   - Save and print

## 📋 Usage Guide

### Creating a New Bill
1. Navigate to "New Bill" from the menu
2. Enter customer details (optional)
3. Select products from the dropdown
4. Enter quantity and click "Add Item"
5. Review the bill summary with GST calculations
6. Use "Preview Bill" to see the final format
7. Click "Save & Print Bill" to complete

### Managing Shop Settings
1. Go to "Settings" from the menu
2. Update shop information
3. Upload your shop logo
4. Configure UPI payment details
5. Set display preferences for bills
6. Save changes

### Bill Features
- **HSN Codes**: Automatic HSN code assignment
- **GST Calculation**: Real-time CGST/SGST calculation
- **UPI Payments**: QR code with exact bill amount
- **Professional Format**: Standard tax invoice layout
- **Print Ready**: Optimized for A4 printing

## 🔧 Development

### Project Structure
```
src/
├── app/
│   ├── components/
│   │   ├── new-bill/          # Billing interface
│   │   ├── shop-settings/     # Shop configuration
│   │   └── coming-soon/       # Placeholder pages
│   ├── services/
│   │   ├── billing.service.ts # Billing logic
│   │   └── shop.service.ts    # Shop settings
│   └── app.component.*        # Main app shell
└── styles.scss                # Global styles
```

### Key Services
- **BillingService**: Handles product data and GST calculations
- **ShopService**: Manages shop settings and localStorage

### Build for Production
```bash
ng build --prod
```

## 📄 License

This project is a POC (Proof of Concept) for demonstration purposes.

## 🤝 Contributing

This is a POC project. For production use, consider:
- Backend API integration
- Database storage
- User authentication
- Advanced reporting
- Inventory management

## 📞 Support

For questions or support regarding this POC, please refer to the Angular documentation or create an issue in the repository.
