# Smart Kirana Store - Auth Module Documentation

Yeh document `Smart Kirana Store` application ke **Auth (Login/Signup)** module ki detailed architectural aur functional information provide karta hai.

## 📁 Directory Structure & Architecture

Pehle Login aur Signup ke components alag folders me the (`login_components`, `signup_components`). Ab unhe combine karke ek central `app/auth/auth_components` me rakha gaya hai taaki code reuse ho sake aur architecture Enterprise-Grade rahe.

- **`login/page.tsx`**: Login page jo `AuthLoginForm` aur `AuthProvider` render karta hai.
- **`signup/page.tsx`**: Signup page jo `AuthSignupForm` aur `AuthProvider` render karta hai.
- **`auth.css`**: Auth module ke specific UI variables yahan define hote hain. **(Strictly No Inline Tailwind Colors)**

### 🧩 `auth_components/`

Har function ek single micro-component me separated hai:

#### 1. Data & State Management (Single Source of Truth)
- **`AuthTypes.ts`**: Login aur Signup forms ke Zod validation schemas.
- **`AuthConstants.ts`**: Static placeholders (e.g., demo credentials).
- **`AuthContext.tsx`**: React Context Provider jo JWT token, user session, aur `login` / `signup` API functions ko globally manage karta hai. 

#### 2. Micro-Components
- **`AuthLoginForm.tsx`**: Phone number aur password capture karne wala component. Direct `AuthContext` ko call karta hai.
- **`AuthSignupForm.tsx`**: Dukaan ka naam, malik ka naam, phone, aur password capture karne wala form.
- **`AuthLoginHeader.tsx` & `AuthSignupHeader.tsx`**: Isolated title components.
- **`AuthDemoHint.tsx`**: Demo instructions banner.

## 🧠 State Management (React Context vs Redux)
Is project me JWT token aur user session ko manage karne ke liye **React Context** (`AuthContext.tsx`) ka use kiya gaya hai. 
Redux jaisi heavy library ka use nahi kiya gaya hai kyunki modern Next.js (App Router) me simple session management ke liye React Context (ya Zustand) kaafi lightweight, isolate, aur "AI-Friendly" hota hai. 

Agar kal ko JWT logic change karni ho, toh sirf `AuthContext.tsx` ko modify karna padega, baaki UI forms untouched rahenge.

## 📌 Summary for AI
- To modify the login validation logic, edit `AuthTypes.ts`.
- To integrate the actual backend API for authentication, edit `AuthContext.tsx`.
- All CSS colors are bound to `auth.css`. Do not add inline Tailwind colors like `text-muted-foreground`.
