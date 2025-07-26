# 📘 Trade Journal App

A personal trading journal application built with **Next.js**, **React**, and **Tailwind CSS**. This app empowers traders to log trades, track performance, analyze strategies, and gain deep insights into their trading psychology — all while storing data securely in the browser using `localStorage`.

---

## ✨ Features

### 📝 New Trade Entry

Log detailed information about each trade:

- Date & Time, Symbol/Asset
- Trade Type (Intraday, Swing, Positional, Scalping)
- Direction (Buy/Sell), Quantity
- Entry/Exit Price, Stop Loss, Target
- Gross & Net P&L, Charges
- Strategy Used, Setup Name, Confirmation Indicators
- Confidence Level, Emotions (Before & After)
- Notes, Mistakes, What Went Well, Tags
- Screenshot upload (UI ready, functionality placeholder)

### 💾 Persistent Trade Data

- All trades are saved locally in `localStorage` for session persistence.

### 📊 Performance & Psychology Analytics

Comprehensive charts to visualize trade data:

- Net P&L by Post-Trade Emotion
- Average Net P&L by Setup
- Win Rate & Avg P&L by Day of Week
- Average P&L by Time of Day
- Risk-to-Reward Ratio vs P&L/Win Rate
- Confidence Level vs Average P&L
- Exit Reasons vs Average P&L
- Mistake Frequency Tracking

### 📋 Trade History & All Trades View

- Chronological, color-coded trade history
- Full data table with hoverable detailed cells

### 📈 Dashboard Overview

- Displays key metrics:
  - Initial Capital
  - Total Trades
  - Total Profit & Loss
  - Charges
  - Net P&L

### 🧑‍💻 Personalized UX

- Prompts for your name on first visit
- Stored in `localStorage` for a custom welcome

### 📱 Responsive Design

- Mobile-friendly and optimized with Tailwind CSS

### 🛠️ Tools Page

Access a suite of trading calculators and utilities to enhance your trading workflow:

- **Position Size Calculator**: Calculate optimal position size based on risk and stop loss.
- **Risk/Reward Calculator**: Analyze potential risk and reward for trades.
- **Compounding Calculator**: Visualize account growth with compounding returns.
- **Simple Returns Calculator**: Quickly compute simple returns for trades or periods.
- **Trading Plan Checklist**: Ensure discipline with a customizable trading plan checklist.

All tools are accessible from the Tools page and are designed for ease of use, with results displayed instantly and no data sent to any server.

### 🧩 Reusable Components

- DRY design using shared components like `FormField`

---

## 🚀 Technologies Used

- **Next.js 14+** – Full-stack React framework
- **React.js** – UI library
- **Tailwind CSS** – Utility-first CSS framework
- **Recharts** – Charting components for React
- **localStorage** – Client-side data persistence

---
