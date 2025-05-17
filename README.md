# CampusCore

*A CSE 300 Project at Stony Brook University*

---

## About

**CampusCore** is a native mobile app developed as a project for CSE 300 (Technical Communications) at Stony Brook University. The app was designed and prototyped by a student team in Spring 2025 to address the fragmented digital experience faced by SBU students. CampusCore aims to unify campus resources-such as events, services, and student profiles-into a single, intuitive platform.

---

## Features

The following features are implemented and demonstrated in this repository and the associated presentation:

### 🏠 Home Screen
- **Campus Services Grid:** Quick access to essential campus services (Schedule, Courses, Community/Events, Resources, Fitness, Transport, Dining, Printing, Profile).
- **Quick Links:** Direct links to SBU’s Academic Calendar, Campus Map, Brightspace, and SOLAR.
- **Welcome Card & Emergency Card:** Friendly greeting and one-tap access to campus emergency services.
- **Info Modals:** Contextual modals for unavailable features and transport/dining options.

### 📅 Events Screen
- **Live Events Feed:** Fetches and displays upcoming campus events from the SB Engaged API.
- **Search Bar:** Filter events by name, location, organization, or category.
- **Event Cards:** Each event shows an image, name, time, location, host, and categories.
- **Loading & Error States:** User-friendly feedback during data fetching or network issues.

### 👤 Profile Screen
- **Digital ID Card:** Displays user’s name, SBU ID, status, and profile image in a visually distinct card.
- **Use Digital ID Card Button:** Placeholder for future campus ID integration.
- **Log Out Button:** Placeholder for authentication integration.

---

## Running the App

To run CampusCore on your device:

1. **Install [Expo Go](https://expo.dev/client) from the App Store or Google Play.**
2. **Start the development server:**
   ```
   pnpm expo start
   ```
3. **Scan the QR code:**  
   After running the command, a QR code will appear in your terminal or browser.  
   - On Android: Open Expo Go, tap "Scan QR Code," and scan the code.
   - On iOS: Use the default Camera app to scan the QR code and follow the prompt.

> **Note:** Your computer and mobile device must be on the same Wi-Fi network.  
> If you have connection issues, try starting the server with `pnpm expo start --tunnel`.

For more details, see the [Expo documentation](https://docs.expo.dev/get-started/start-developing/).

---

## Tech Stack

- **React Native** (with Expo)
- **TypeScript**
- **NativeWind** (Tailwind CSS for React Native)
- **Expo Modules** (expo-constants, expo-application, etc.)

---

## Project Context

This project was created as part of **CSE 300: Technical Communications** at Stony Brook University.  
The goal was to produce a real-world technical product, practice collaborative development, and deliver professional documentation and presentations.
