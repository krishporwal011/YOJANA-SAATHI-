# UptimeRobot Setup Guide for Yojana Saathi Backend

This guide explains how to set up continuous HTTP monitoring for the **Yojana Saathi** backend API deployed on Render using [UptimeRobot](https://uptimerobot.com).

---

## 1. Overview & Benefits

- **Health Check Endpoint**: `/api/health`
- **Primary Objectives**:
  - Monitor API availability and uptime 24/7.
  - Receive instant alerts via Email/Slack/Webhook if the backend API goes down.
  - Prevent Render free tier web services from sleeping due to inactivity by sending periodic ping requests every 5–10 minutes.

---

## 2. Step-by-Step UptimeRobot Configuration

### Step 1: Log In or Register
1. Go to [https://uptimerobot.com](https://uptimerobot.com).
2. Sign in or create a free UptimeRobot account.

### Step 2: Add a New Monitor
1. In the UptimeRobot Dashboard, click the **"+ Add New Monitor"** button.
2. Configure the following field values:

| Field | Recommended Value | Description |
| :--- | :--- | :--- |
| **Monitor Type** | `HTTP(s)` | Standard web request monitoring |
| **Friendly Name** | `Yojana Saathi Backend` | Display name in dashboard |
| **URL (or IP)** | `https://<YOUR-RENDER-BACKEND-URL>.onrender.com/api/health` | The public health endpoint URL |
| **Monitoring Interval** | `5 minutes` | Recommended interval to keep service warm |
| **HTTP Method** | `GET` | Standard GET request |

### Step 3: Configure Advanced Options (Optional but Recommended)
1. Under **Keyword Checking** (if desired):
   - **Keyword**: `"status": "healthy"`
   - **Alert When Keyword**: `Exists`
2. Under **Alert Contacts to Notify**:
   - Check your primary notification channels (e.g., Email, Discord, Telegram, or Webhook).

### Step 4: Save & Start Monitoring
1. Click **"Create Monitor"**.
2. UptimeRobot will start sending `GET` requests to `/api/health` at your specified interval.

---

## 3. Expected API Response

When UptimeRobot pings the `/api/health` endpoint, the backend responds with **HTTP 200 OK** and the following JSON payload:

```json
{
  "status": "healthy",
  "service": "Yojana Saathi API",
  "version": "1.0.0"
}
```

---

## 4. Verification & Testing

1. Open your terminal or browser and test the deployed URL manually:
   ```bash
   curl -i https://<YOUR-RENDER-BACKEND-URL>.onrender.com/api/health
   ```
2. Verify that:
   - Status code is `200 OK`.
   - Response header `Content-Type` is `application/json`.
   - Response body contains `"status": "healthy"`.
3. Check the UptimeRobot dashboard to confirm the monitor status shows **"Up"** (green indicator).

---

## 5. Troubleshooting & Notes

- **Cold Starts**: If using Render's Free Tier, the initial request after a long period of inactivity may take 15–30 seconds. Setting the UptimeRobot monitoring interval to **5 minutes** keeps the instance active and prevents cold-start delays for citizens.
- **Environment Variables**: Ensure your Render service has `FRONTEND_URL` set to your Vercel deployment URL (e.g., `https://yojana-saathi.vercel.app`).
