# WorkSphere - Employee Management System

WorkSphere is a web-based Employee Management System designed for Admins to efficiently manage employees, attendance, leave requests, and salary details from a single dashboard.

This project was built to simplify daily HR operations by replacing manual records with a fast, organized, and centralized system.

---

## 🚀 Features

### 1. Admin Authentication
- Secure Admin Login and Logout
- Session management using Local Storage

### 2. Dashboard
- View Total Employees
- View Present / Absent Employees
- View Pending Leave Requests
- Quick navigation to all modules

### 3. Employee Management
- Add New Employee
- Edit Employee Details
- Delete Employee
- Search Employee by Name or Email
- Filter Employees by Department

### 4. Attendance Management
- Mark Daily Attendance
- View Attendance History
- Filter by Date and Employee

### 5. Leave Management
- Employee can Apply for Leave
- Admin can Approve / Reject Leave
- Track Leave Status - Pending, Approved, Rejected

### 6. Salary Management
- Store Basic Salary for Each Employee
- Calculate Salary Based on Attendance
- View Salary Details Department-wise

---

## 🛠️ Technologies Used

### Frontend
- **HTML5** - For Page Structure
- **CSS3** - For Styling, Layout, Sidebar, Dashboard UI
- **JavaScript (ES6 Modules)** - For Logic, API Calls, Dynamic Data Rendering
- **VS Code Live Server** - For Local Development

### Backend / Database
- **Supabase** - Backend as a Service (BaaS)
- **Supabase PostgreSQL Database** - For Data Storage
- **Supabase JavaScript Client** - For Connecting Frontend to Database
- **Supabase Auth Logic** - Using Custom User Table Authentication

No separate Node.js / Express backend is used. The Frontend directly communicates with Supabase.

---

## 🗄️ Database Structure

**Database Name:** Supabase PostgreSQL
**Main Table Used:** `users`

We used a single-table design for simplicity and fast access. All users are stored in one table and separated by `role`.

### Table: `users`

| Column Name | Type | Description |
| --- | --- | --- |
| id | UUID / Integer | Primary Key, Unique ID |
| name | Text | Full Name of the User |
| email | Text | Unique Email, Used for Login |
| password | Text | Login Password |
| role | Text | Admin or Employee |
| dept | Text | Department - IT, HR, Design, Sales |
| department | Text | Duplicate of dept for compatibility |
| basic_salary | Number | Basic Monthly Salary |

### Why Only One Table?

All employees are stored in the `users` table with `role = 'Employee'`.
Admin is also stored in the same table with `role = 'Admin'`.
This makes login, role-checking, and employee listing faster and simpler.

**Example Query to Get Employees:**
```sql
SELECT * FROM users WHERE role = 'Employee';

```

## 📁 Project Structure

WorkSphere/
- index.html - Login Page
- dashboard.html - Admin Dashboard
- employees.html - Employee Management Page
- attendance.html - Attendance Page
- leave.html - Leave Management Page
- salary.html - Salary Page
- dashboard.css - Common Styling
- api.js - Supabase Connection File
- employees.js - Employee Logic
- attendance.js - Attendance Logic
- leave.js - Leave Logic
- salary.js - Salary Logic
- README.md - Project Documentation

---

## ⚙️ How to Run the Project

1. Clone the Repository
2. Open the Project Folder in VS Code
3. Install Live Server Extension in VS Code
4. Right-click on `index.html` and Select `Open with Live Server`
5. Login with HR Credentials
   - Email: hr@worksphere.com
   - Password: hr123
6. Start Managing Employees from the Dashboard

---

## 🔮 Future Scope

- Employee Self Login Portal
- Payslip Download as PDF
- Leave Status Notification Inside Website
- Mobile Responsive Design

---

## 👨‍💻 Author

**Project:** WorkSphere - Employee Management System
**Developed By:**  Bhatraju Naga Vignesh
**Database:** Supabase PostgreSQL