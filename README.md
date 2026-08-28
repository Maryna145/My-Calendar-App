# Desktop Calendar Widget 🗓️

A sleek, frameless desktop calendar widget built with Electron, React, Node.js, and MongoDB. Designed to stay neatly on your desktop with a transparent glass-morphism UI, providing seamless event management and real-time local notifications.
## 📸 Preview

![Desktop Calendar Widget](./screenshots/calendar.png)
## Features

* **Frameless Transparent UI:** A compact, draggable widget with a modern glass-morphism effect (`backdrop-filter`).
* **Event Management:** Full CRUD operations to add, view, and organize daily tasks and meetings.
* **Local Notifications:** Native Windows desktop notifications and in-app alerts triggered automatically at the scheduled event time.
* **Optimized UX:** Smooth vertical scrolling with a hidden scrollbar and a sticky "Add Event" button for quick access.
* **Color Coding:** Categorize events using a custom color picker.
* **Standalone Portable Build:** Easily packaged into an independent Windows `.exe` executable.

## Tech Stack

* **Frontend:** React, JavaScript, CSS (Custom UI, *Bebas Neue* & *Comfortaa* fonts)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Desktop Wrapper:** Electron, electron-builder

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) installed
* Local or cloud MongoDB database running

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/calendar-app.git
   cd calendar-app
   ```

2. **Set up the Backend:**

   Navigate to the backend directory and install dependencies:

   ```bash
   cd calendar-backend
   npm install
   ```

   Create a `.env` file in the `calendar-backend` directory and add your MongoDB URI:

   ```env
   MONGO_URI=mongodb://localhost:27017/your_db_name
   ```

   Start the backend server:

   ```bash
   node index.js
   ```

3. **Set up the Frontend / Electron App:**

   Open a new terminal, navigate to the main app directory, and install dependencies:

   ```bash
   npm install
   ```

   Run the app in development mode:

   ```bash
   npm run electron
   ```

## Packaging for Production

To create a standalone portable executable for Windows:

1. Build the React app and package the Electron environment:

   ```bash
   npm run build
   npm run pack
   ```

2. Navigate to the generated build folder:

   ```text
   release/win-unpacked/resources/
   ```

3. Create a `calendar-backend` folder inside `resources` and manually copy your backend `node_modules` and `.env` files into it.

4. Run `MyCalendar.exe` to launch the widget.
## Credits

The initial frontend interface was inspired by a YouTube tutorial. 
The original tutorial was used only as a reference for the frontend implementation.

The project was then significantly adapted and extended by me using Node.js, Express.js, MongoDB, Mongoose, React, and Electron, including backend integration, database functionality, desktop application packaging, and local notifications.

**Original tutorial:** [React Tutorial: Creating a Fully Functional Calendar App with React](https://www.youtube.com/watch?v=wDayVPGWipI&t=63s)
