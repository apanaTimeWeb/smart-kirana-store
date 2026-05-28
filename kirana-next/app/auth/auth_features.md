# Smart Kirana Store - Auth Module Documentation

Yeh document `Smart Kirana Store` application ke **Auth (Authentication)** module ki functional aur UI details provide karta hai. Iska main purpose naye developers ko login aur signup flows samajhne me madad karna hai.

## 📁 Directory Structure & Architecture

Auth module `app/auth` directory me sthit hai, jiske andar do main sub-modules hain: `login` aur `signup`.

- **`layout.tsx`**: Dono pages ke liye ek common minimal layout provide karta hai (with a dark background and centered content).
- **`login/`**:
  - `page.tsx`: Login page render karta hai.
  - `login.css`: Login page ke specific UI styles.
  - `login_components/`: Isme `LoginForm.tsx` (Phone aur Password ka form), `LoginHeader.tsx` (Logo aur title), aur `DemoHint.tsx` (Demo account ke liye guidance box) hain.
- **`signup/`**:
  - `page.tsx`: Signup page render karta hai.
  - `signup.css`: Signup page ke specific UI styles.
  - `signup_components/`: Isme `SignupForm.tsx` (Dukaan ka naam, Malik ka naam, Phone, Password inputs), `SignupHeader.tsx`, aur `DemoHint.tsx` hain.

## 🛠 Core Features & Workflow

### 1. Login Flow (`/auth/login`)
- **UI Elements**: 
  - Phone Number input (type="tel").
  - Password input jiske saath ek eye icon ("👁") diya gaya hai password ko show/hide karne ke liye.
- **Demo Mode**: Abhi application demo state me hai, isliye form me ek demo phone number (`9876543210`) aur password (`demo1234`) pehle se pre-filled aate hain.
- **Navigation**: Submit par click karne se form simulate karta hai (700ms loading state) aur fir seedha `/dashboard` par redirect kar deta hai. Saath hi ek link "Register Karein" Signup page par le jata hai.

### 2. Signup Flow (`/auth/signup`)
- **UI Elements**:
  - Naya dukandaar onboard karne ke liye: Dukaan Ka Naam, Malik Ka Naam, Phone Number, aur Password Banayein (with show/hide eye icon).
- **Demo Mode**: Naya account banane ke liye bhi ek demo set pehle se filled aata hai (jaise "Ramesh General Store", "Ramesh Kumar").
- **Navigation**: Form submit karne par loading state show hoti hai aur fir `/dashboard` par user redirect ho jata hai. Ek link "Login Karein" back login screen par le jata hai.

## 🧠 State Management & API
- **Client-Side Form**: Form state aur loading UI React ke `useState` hooks (`show`, `loading`, `phone`, `password` etc.) se handle hoti hai kyonki yeh `"use client"` components hain.
- **No Real Backend (Yet)**: Abhi tak kisi real authentication provider (jaise Firebase, Auth0, ya NextAuth) ka integration nahi kiya gaya hai. Form submit hone par sirf `setTimeout` ka use karke mock API call simulate ki gayi hai.

## 🚀 AI & Developer Context: Future Enhancements
Agar future me is module ko production ready banana ho:

1. **OTP Based Login**: Password ki jagah ya password ke saath Phone Number + OTP based authentication lagana Indian kirana store owners ke liye zyada easy rahega. Twilio ya Firebase Auth ka use karke.
2. **NextAuth Integration**: Session management ke liye `next-auth` set up karna padega taaki secured routes (`/dashboard`, `/billing` etc.) par directly koi bina login ke access na kar paye. (Abhi un-protected routes hain).
3. **Form Validation**: Zod aur React Hook Form ka use karke proper validation (jaise Phone number 10 digit ka ho) lagani hogi.
4. **Forgot Password**: Password reset karne ka flow abhi missing hai, jise add karna hoga.

## 📌 Summary for Quick Handover
- UI poori tarah responsive aur polished hai. Tailwind CSS aur ShadCN UI components (Card, Input, Button, Label) ka proper upyog kiya gaya hai.
- Login/Signup forms components ke andar separated hain jisse aage chalkar unhe API ke saath jodna bohot aasan hoga.
