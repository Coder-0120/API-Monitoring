# 🌐📊 APIFlux – Real-Time API Monitoring System 🚀🔍  

**APIFlux** is a modern, secure, and responsive **real-time API monitoring web application** built to help developers and businesses track API uptime, performance, and response trends efficiently.

It provides live API health tracking, response analytics, detailed logs, and visual performance insights — all from a powerful dashboard.
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b5f99ef8-9912-45e7-ae2b-2270601361cf" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c29e2dc7-25d3-46ac-a04d-2d09533991a4" />



---

## 🌟 What is APIFlux?

**APIFlux** ensures your APIs stay reliable and performant by offering:

- ✅ Real-time API health monitoring  
- 📊 Response time analytics  
- 📈 Uptime percentage calculation  
- 📜 Detailed API logs  
- 📉 24-hour response time trend chart  
- 🔄 Automated monitoring using Cron Jobs  

It delivers complete visibility into your API performance.

---

## 🚀 Key Features

### 🔐 Authentication & Security
- 🔑 Secure Signup & Login  
- 🔒 JWT Authentication  
- 🛡️ Protected Routes  
- 👤 User-specific APIs (Each user sees only their APIs)

---

### 🌐 API Management
- ➕ Add new API endpoint  
- 🗑️ Delete API anytime  
- 📋 View all APIs in dashboard  
- 🔄 Automatic periodic health checks  

---

### 📊 Real-Time API Status Display

Each API card shows:

- 🟢 **Status** (UP / DOWN)  
- ⏱️ **Response Time (ms)**  
- 🕒 **Last Checked Time**  
- 📈 **Uptime Percentage**  
- ⚡ **Average Response Time**

Example:

```
Status: DOWN  
Response Time: 495 ms  
Last Checked: 1:26:08 AM  
Uptime: 50.00%  
Avg Response Time: 454 ms  
```

---

### 📜 View All Logs

Users can click **📊 View All Logs** to see:

- 🕒 Timestamp of each request  
- 📉 Response time  
- ❌ Error details (if API failed)  
- 📊 Historical monitoring data  

---

### 📈 Response Time Trend Chart

📊 Displays **Average Response Time per Hour (Last 24 Hours)**

Includes:
- 🔺 Peak Response Time (e.g., 761 ms)  
- 📉 Average Response Time (e.g., 691 ms)  

Helps identify:
- Performance spikes  
- Slow API behavior  
- Downtime patterns  

---

## ⏰ Automated Monitoring with Cron

APIFlux uses **Node-Cron** to automatically check API health at fixed intervals.

### 🔄 How It Works:

- Cron runs every X minutes  
- Sends HTTP request to each stored API  
- Measures response time  
- Updates API status (UP/DOWN)  
- Saves log in database  
- Recalculates uptime & averages  

This ensures **continuous real-time monitoring without manual refresh.**

---

## 📊 Dashboard Overview

- 📦 Total APIs Monitored  
- 🟢 APIs UP  
- 🔴 APIs DOWN  
- 📈 Uptime Statistics  
- 📉 Performance Insights  

---

## 📱 Fully Responsive Design

- 📱 Mobile Friendly  
- 💻 Desktop Optimized  
- 📦 Smooth Scrolling  
- 🎨 Clean & Modern UI  

---

## 🛠️ Tech Stack

- 🖥️ Frontend: React.js  
- ⚙️ Backend: Node.js, Express.js  
- 🗄️ Database: MongoDB  
- 🔐 Authentication: JWT  
- 📊 Charts: Chart.js / Recharts  
- ⏰ Scheduler: Node-Cron  
- 🌐 HTTP Requests: Axios  

---

## ⚙️ How APIFlux Works

1️⃣ User logs in  
2️⃣ Adds API endpoint  
3️⃣ Cron automatically checks APIs periodically  
4️⃣ Logs stored in MongoDB  
5️⃣ Uptime & averages calculated  
6️⃣ Dashboard updates with live insights  

---

## ⚡ Getting Started

### 🔽 Clone Repository
```bash
https://github.com/Coder-0120/API-Monitoring.git
cd apiflux
```

---

### 📦 Install Backend Dependencies
```bash
cd server
npm install
```

---

### 📦 Install Frontend Dependencies
```bash
cd client
npm install
```

---

### 🔐 Create `.env` File (Server)

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

### ▶️ Run Development Server
```bash
npm run dev
```

Frontend:
```
http://localhost:3000
```

Backend:
```
http://localhost:5000
```

---

## 🎯 Use Cases

- 🚀 Monitor deployed production APIs  
- 🏢 Track company services uptime  
- 📊 Analyze response time trends  
- 🔍 Debug API performance issues  

---

## 🧠 Future Enhancements

- 🔔 Email alerts when API goes DOWN  
- 📱 Push notifications  
- 📊 Weekly/Monthly reports  
- 🌍 Public status page  
- ⚡ Advanced performance analytics  

---

⭐ If you like APIFlux, don’t forget to star the repository!
