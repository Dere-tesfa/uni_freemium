# **Product Requirements Document (PRD)**

**Project Name:** SmartExam Ethiopia (Placeholder)
**Stack:** React Router v7 (Framework Mode), Tailwind CSS, Database (PostgreSQL/Supabase).

---

## **1. Project Overview**

**Objective:** To provide Ethiopian university students with a mobile-first, highly optimized platform for accessing exam sheets, detailed answers, and micro-lessons.
**Key Value Proposition:** Instant access, offline capability, deep explanations not found in standard PDFs, and a localized manual payment gateway.

---

## **2. Target Audience**

- **Primary:** University students in Ethiopia (primarily accessing via mobile devices on 3G/4G networks).
- **Secondary:** Teachers/Tutors looking to upload content (if applicable in future phases).

---

## **3. Functional Requirements**

### **3.1. Authentication & User Management**

- **Phone-First Registration:** Users register using their phone number (critical for Ethiopia) and a password. Email is optional.
- **Secure Login:** JWT-based authentication.
- **Profile Management:**
    - View purchased sheets.
    - View payment history (Pending, Approved, Rejected).
    - Reset password via OTP (if possible) or manual admin reset.

### **3.2. The "Dynamic" Exam Sheet System (The Core Feature)**

- **Non-PDF Rendering:** Questions must be rendered as interactive UI components, not embedded PDFs. This allows for:
    - **Responsive Text:** Adjusts to mobile screens perfectly.
    - **Interactive Elements:** Tap to reveal answers.
- **The "Deep Dive" Structure:** Each question block contains:
    1.  **The Question:** Text + Image support.
    2.  **Choices:** Multiple choice options (A, B, C, D).
    3.  **Answer Reveal:** A button to reveal the correct answer.
    4.  **Deep Explanation:** A dedicated section explaining the logic/concept.
    5.  **Related Micro-Lesson:** A "Did you know?" or "Key Concept" box summarizing the theory behind the question.

### **3.3. Student Interface (Frontend)**

- **PWA (Progressive Web App):** _Critical Addition._ The site must be installable on a home screen. It must support **Offline Mode** (students can view opened sheets without internet).
- **Homepage:**
    - Search bar (by Course Code, Title).
    - "Free Sheets" section (accessible to guests).
    - "New Arrivals" section.
- **Exam Player Interface:**
    - **Mode 1: Practice Mode:** Instant feedback after every question.
    - **Mode 2: Exam Mode:** User answers all questions, submits, and gets a score at the end (optional future feature).
- **Bookmarks/Save:** Ability to "star" specific difficult questions for later review.
- **Dark Mode:** Essential for students studying at night.

### **3.4. Monetization & Payment System**

- **Freemium Model:** Clear distinction between Free and Locked content.
- **Manual Payment Gateway (Ethiopia Specific):**
    1.  **Checkout Page:** Displays dynamic bank details (Admin can change these in settings).
    2.  **Upload Proof:**
        - Camera capture (mobile) or File Upload.
        - Image compression (client-side) to save bandwidth.
    3.  **Status Tracker:** Real-time status: _Pending -> Approved/Rejected_.
    4.  **Admin Notification:** Dashboard alert for new payment uploads.

### **3.5. Admin Panel (The Control Center)**

- **Dashboard:**
    - Total Revenue (Daily/Monthly).
    - Total Users.
    - Pending Payments count.
- **Content Management System (CMS):**
    - **Sheet Creator:** A rich text form to input questions one by one.
    - **Bulk Import (Added Requirement):** Ability to upload a CSV file to populate questions quickly (saves admin time).
    - **Sheet Settings:** Set price (ETB), toggle Free/Locked, select University/Department.
- **Payment Management:**
    - **Verification Queue:** List of pending requests showing: User Info, Screenshot, Date.
    - **Action:** "Approve" (Grants access instantly) / "Reject" (Prompts admin to enter reason, e.g., "Wrong Amount").
- **Settings:**
    - **Bank Accounts:** Manage which bank accounts are shown to users (e.g., CBE, Telebirr, Awash).

---

## **4. Non-Functional Requirements (The Engineering)**

### **4.1. Performance & Optimization (Mobile First)**

- **Lightweight:** Initial page load < 1.5MB.
- **Image Optimization:** All uploaded images must be converted to **WebP** format and resized to max 800px width to save student data.
- **Data Saver Mode:** Option to hide images unless tapped.
- **Lazy Loading:** Questions load as the user scrolls down (infinite scroll) rather than loading 100 questions at once.

### **4.2. Security**

- **Route Protection:** React Router `loaders` must check authentication before sending premium data.
- **Screenshot Prevention (Basic):** Disable right-click and basic print-screen hooks (note: this is never 100% secure, but prevents casual copying).
- **Signed URLs:** Payment screenshots should be stored in private buckets with signed, expiring URLs to prevent link sharing.

### **4.3. Reliability**

- **Error Boundaries:** Graceful error handling if the internet cuts out during an exam.
- **Form Persistence:** If a user is typing an answer or uploading a payment and the page refreshes, the form data should be preserved (using `localStorage`).

---

## **5. Database Schema Design (Conceptual)**

To implement this in React Router v7, you need a structured database. Here is the recommended schema:

**Table: `Users`**

- `id`, `phone`, `password_hash`, `role` (student/admin), `created_at`.

**Table: `Sheets`**

- `id`, `title`, `course_code`, `university`, `year`, `price` (0 for free), `is_published`.

**Table: `Questions`**

- `id`, `sheet_id` (Foreign Key), `question_text`, `image_url`, `options` (JSON), `correct_answer`, `explanation`, `lesson_content`.

**Table: `Purchases`**

- `id`, `user_id`, `sheet_id`, `status` (pending/approved/rejected), `screenshot_url`, `created_at`, `approved_at`.

**Table: `Settings`**

- `key` (e.g., "bank_account_cbe"), `value` (the account number).

---

## **6. Added Value Features (Recommendations)**

1.  **"Share & Unlock" (Growth Hack):**
    - Allow users to share a specific link to the app. If 3 friends click their link, they get one sheet for free. This drives organic traffic.

2.  **Telegram/WhatsApp Bot Integration:**
    - Since Ethiopian students live on Telegram, build a simple bot that notifies them when their payment is approved or when new sheets for their department are uploaded.

3.  **Admin Financial Reconciliation:**
    - A feature in the Admin Panel to "Filter by Date" and see total approved payments to cross-check with the actual bank statement.

---

## **7. Development Phases (Roadmap)**

**Phase 1: MVP (Minimum Viable Product)**

- Auth System (Phone/Pass).
- Sheet Viewer (Practice Mode).
- Manual Payment Upload & Admin Approval.
- Mobile Responsive Design.

**Phase 2: Optimization**

- PWA (Offline Access).
- Dark Mode.
- Performance Optimization (Image compression).

**Phase 3: Scale**

- Telegram Notifications.
- Bulk CSV Import for questions.
- "Exam Mode" (Timed tests).

---

**Does this structure cover everything you envisioned? If you approve this document, we can proceed to designing the Folder Structure for your React Router v7 project.**
