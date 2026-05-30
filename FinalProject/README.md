# 🐾 PetParadise — React Native (Expo) App

A full-featured pet products marketplace with **Customer**, **Seller**, and **Admin** portals, built with Expo + Firebase.

---

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (iOS/Android) **or** an Android/iOS emulator

---

## 🚀 Getting Started

```bash
# 1. Navigate to the project folder
cd PETPARADISE

# 2. Install dependencies
npm install

# 3. Start the app
npx expo start
```

Then scan the QR code with **Expo Go** (Android) or **Camera app** (iOS).

---

## 🔥 Firebase Setup

The app uses a pre-configured Firebase project (`petapp-3cdee`). It supports:
- **Authentication** (email/password)
- **Firestore** (products, orders, users)

### To use your own Firebase project:
Edit `frontend/constants/firebaseConfig.js` with your own Firebase credentials from the [Firebase Console](https://console.firebase.google.com).

### Required Firestore Collections:
- `users` — stores user profiles with a `role` field (`customer` / `seller` / `admin`)
- `products` — product listings added by sellers
- `orders` — placed by customers at checkout

### Creating an Admin Account:
1. Register as a Customer first, then manually change `role` to `"admin"` in Firestore.

---

## 📱 App Screens

### Customer
| Screen | Description |
|--------|-------------|
| CustomerAuthScreen | Login / Register |
| CustomerDashboard | Home with categories & stats |
| ProductListingScreen | Browse & search products |
| CartScreen | View cart, update quantities |
| CheckoutScreen | Place order, get invoice |

### Seller
| Screen | Description |
|--------|-------------|
| SellerAuthScreen | Login / Register Store |
| SellerDashboard | Stats, recent orders |
| ManageProductsScreen | Add / Edit / Delete products |

### Admin
| Screen | Description |
|--------|-------------|
| AdminAuthScreen | Secure admin login |
| AdminDashboard | Platform-wide stats |
| SalesReportScreen | Full order analytics |

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| Expo SDK 50 | React Native framework |
| Firebase 10 | Auth + Firestore DB |
| React Navigation 6 | Navigation (Stack + Tabs) |
| Formik + Yup | Form validation |
| @expo/vector-icons | Ionicons |
| @expo-google-fonts/nunito | Typography |
| AsyncStorage | Persistent local state |

---

## 📁 Project Structure

```
PETPARADISE/
├── App.js                          # Root component
├── index.js                        # Entry point
├── app.json                        # Expo config
├── babel.config.js
├── package.json
└── frontend/
    ├── constants/
    │   ├── firebaseConfig.js       # Firebase init
    │   └── ThemeContext.js         # Global state (theme, user, cart)
    ├── globalStyling.js            # Shared styles
    ├── navigation/
    │   └── AppNavigator.js         # All navigation logic
    └── screens/
        ├── SplashScreen.js
        ├── RoleSelectScreen.js
        ├── customer/
        │   ├── CustomerAuthScreen.js
        │   ├── CustomerDashboard.js
        │   ├── ProductListingScreen.js
        │   ├── CartScreen.js
        │   └── CheckoutScreen.js
        ├── seller/
        │   ├── SellerAuthScreen.js
        │   ├── SellerDashboard.js
        │   └── ManageProductsScreen.js
        └── admin/
            ├── AdminAuthScreen.js
            ├── AdminDashboard.js
            └── SalesReportScreen.js
```

---

## ✅ Fixes Applied (from original code)

1. **Broken JSX comments** — `{/ ... /}` → `{/* ... */}` throughout
2. **Firebase Auth persistence** — replaced `getAuth()` with `initializeAuth()` + `getReactNativePersistence(AsyncStorage)` for proper session persistence on mobile
3. **Missing `RoleSelectScreen`** — was imported but not included in original file listing
4. **Missing screens** — `SellerDashboard`, `ManageProductsScreen`, `AdminAuthScreen`, `AdminDashboard`, `SalesReportScreen` were fully built
5. **Font family references** — removed font-family strings (Nunito) from StyleSheets where fonts may not load in dev; fontWeight used instead for reliability
6. **Formik onSubmit** — added `setSubmitting(false)` in CheckoutScreen to fix button stuck in loading state
7. **Firebase error handling** — improved error catching and user-facing messages
