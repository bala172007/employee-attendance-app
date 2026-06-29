# AttendTrack - Employee Attendance System

AttendTrack is a professional-grade mobile attendance application built with React Native and Expo. It is designed to allow employees to log their daily attendance (Check-In/Check-Out) with high precision using real-time GPS coordinates and secure local storage.

## 🚀 Key Features

* **Secure Authentication:** Simple, client-side employee identification.
* **GPS-Verified Attendance:** Captures precise latitude and longitude during every Check-In and Check-Out.
* **Offline First:** Built with `AsyncStorage` to ensure attendance data is persisted locally and remains accessible even without an internet connection.
* **Live Dashboard:** Features a real-time clock ticker and a status dashboard that tracks the employee's attendance lifecycle (Not Checked In → Checked In → Completed).
* **Professional UI:** Modern interface with loading overlays, status badges, and intuitive navigation.

## 🛠 Technology Stack

* **Framework:** [React Native](https://reactnative.dev/) (via [Expo](https://expo.dev/))
* **Language:** TypeScript
* **Navigation:** React Navigation (Native Stack)
* **Local Storage:** `@react-native-async-storage/async-storage`
* **Hardware API:** `expo-location`

## 📂 Project Structure

```text
src/
├── components/       # Reusable UI (CustomButton, CustomInput, Loading)
├── navigation/       # Stack navigator configuration
├── screens/          # LoginScreen and DashboardScreen
├── services/         # Logic for GPS and AsyncStorage operations
├── types/            # TypeScript interfaces and shared models
└── utils/            # Constants, date formatting, and form validators
```
⚙️ Installation & Setup
Prerequisites
Node.js installed on your machine.

Expo Go app installed on your physical mobile device.

Steps
Clone the Repository

Bash
git clone [https://github.com/bala172007/employee-attendance-app.git](https://github.com/bala172007/employee-attendance-app.git)
cd employee-attendance-app
Install Dependencies

Bash
npm install
Start the Project

Bash
npx expo start -c
Launch
Scan the QR code displayed in your terminal using the Expo Go app to start the application on your device.

👤 Author
Bala M

Email: mtharan268@gmail.com

GitHub: @bala172007


***

### One Final Step for your Internship Submission:
Since you have just updated the `README.md` file locally, you need to push this to GitHub so your manager can see the documentation:

1.  `git add README.md`
2.  `git commit -m "Add professional README documentation"`
3.  `git push origin main`

You are now 100% finished with the project and the documentation. Excellent work! Do you
