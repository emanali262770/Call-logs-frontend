# 🛍️ ShopHub - Modern E-commerce Frontend

A beautiful, modern e-commerce frontend built with React + Vite, featuring Stripe integration, authentication, and a complete shopping experience.

![ShopHub](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop)

## ✨ Features

### 🧑‍💼 Customer Features
- **Product Catalog** - Browse products with categories, search, and filters
- **Shopping Cart** - Add/remove items with persistent local storage
- **Stripe Checkout** - Secure payment processing with Stripe
- **User Authentication** - Login/register with JWT tokens
- **Responsive Design** - Works perfectly on all devices
- **Toast Notifications** - Real-time feedback for all actions

### 🔐 Admin Features
- **Admin Dashboard** - Product management interface
- **Add/Edit/Delete Products** - Full CRUD operations
- **Order Management** - View and manage customer orders
- **Analytics** - Sales and user statistics

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd shophub-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:3001/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:8080` to see your store!

## 💳 Stripe Integration Guide

### 1. Get Your Stripe Keys

**Test Mode (Recommended for development):**
- Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
- Copy your **Publishable key** (starts with `pk_test_`)
- Paste it in your `.env` file as `VITE_STRIPE_PUBLISHABLE_KEY`

**Live Mode (For production):**
- Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- Copy your **Publishable key** (starts with `pk_live_`)

### 2. Test Cards for Development

Use these test card numbers with Stripe:

| Card Number | Brand | Result |
|-------------|-------|---------|
| `4242424242424242` | Visa | Success |
| `4000000000000002` | Visa | Declined |
| `4000000000009995` | Visa | Declined (insufficient funds) |

**Test Details:**
- **Expiry:** Any future date (e.g., 12/34)
- **CVC:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

### 3. Webhook Setup (Optional)

For production, set up webhooks:
1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`

## 🔐 Authentication

### Demo Accounts

For testing, use these credentials:

**Regular User:**
- Email: `user@demo.com`
- Password: `any password`

**Admin User:**
- Email: `admin@demo.com`
- Password: `any password`

### API Integration

Replace the mock authentication in `src/context/AuthContext.tsx` with your actual API:

```typescript
const login = async (email: string, password: string) => {
  const response = await fetch(`${process.env.VITE_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  // Handle response...
};
```

## 🎨 Design System

The app uses a custom design system with:

- **Colors:** Emerald primary, amber secondary, violet accent
- **Typography:** Clean, readable font hierarchy
- **Animations:** Smooth transitions and hover effects
- **Components:** Reusable, themed components

### Customization

Edit `src/index.css` to customize colors and styles:

```css
:root {
  --primary: 160 84% 39%;        /* Emerald */
  --secondary: 45 93% 58%;       /* Amber */
  --accent: 262 83% 58%;         /* Violet */
}
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout/          # Header, Footer
│   └── ProductCard.tsx  # Product display component
├── context/             # React context providers
│   ├── AuthContext.tsx  # Authentication state
│   └── CartContext.tsx  # Shopping cart state
├── data/                # Mock data and API calls
│   └── products.ts      # Product catalog data
├── pages/               # Page components
│   ├── Home.tsx         # Homepage
│   ├── Products.tsx     # Product catalog
│   ├── Cart.tsx         # Shopping cart
│   ├── Checkout.tsx     # Stripe checkout
│   ├── Login.tsx        # User login
│   ├── Register.tsx     # User registration
│   └── Admin.tsx        # Admin dashboard
└── index.css           # Global styles and design system
```

## 🛠️ Built With

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **React Hot Toast** - Notifications
- **Stripe** - Payment processing
- **Lucide React** - Icons

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify

1. Run `npm run build`
2. Drag `dist` folder to [Netlify](https://netlify.com)
3. Set up environment variables
4. Done!

## 📧 Support

Need help? Contact us:
- Email: support@shophub.com
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Happy Shopping!** 🛍️✨