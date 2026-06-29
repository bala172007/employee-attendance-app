# Employee Attendance App

A React Native mobile application built with Expo that allows employees to seamlessly log in and record their daily attendance. This application is designed to function entirely offline, storing all attendance records locally on the device while capturing real-time GPS coordinates and timestamps.

## 🚀 Features

* **Authentication:** Simple login interface (mock authentication for local use).
* **Dashboard Overview:** Displays current attendance status (Not Checked In, Checked In, Completed) and timestamps.
* **Location-Aware Check-In/Check-Out:** Captures exact GPS coordinates and exact time upon checking in and checking out.
* **Offline Data Persistence:** Utilizes AsyncStorage to save records locally, ensuring data remains intact even after the app is completely closed.
* **State Management:** Prevents duplicate check-ins or checking out before a check-in has occurred.

## 🛠 Technology Stack

* **Framework:** [React Native](https://reactnative.dev/) (via [Expo](https://expo.dev/))
* **Language:** TypeScript
* **Navigation:** React Navigation (Native Stack)
* **Local Storage:** `@react-native-async-storage/async-storage`
* **Hardware API:** `expo-location`

## 📂 Project Architecture

```text
employee-attendance-app/
├── src/
│   ├── components/       # Reusable UI components (CustomButton, CustomInput)
│   ├── navigation/       # Screen routing and Stack Navigators
│   ├── screens/          # Application views (LoginScreen, DashboardScreen)
│   ├── services/         # Core logic (Location tracking, AsyncStorage data handling)
│   ├── types/            # TypeScript interfaces and data models
│   └── utils/            # Helper functions (Date/Time formatting, App Constants)
├── App.tsx               # Application entry point
└── package.json          # Project dependencies
