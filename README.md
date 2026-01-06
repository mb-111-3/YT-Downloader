
# YouTube Downloader (Local)

A simple web-based YouTube video downloader with a **dark hacker theme**.  
Fetch video info, select quality, and download videos **locally** on your computer.  

---

## Features

- Dark hacker-like theme with animations  
- Mobile-responsive UI  
- Shows video title, thumbnail, and available qualities  
- Dropdown to select video quality  
- Download videos with **real file names**  
- No FFmpeg required (progressive streams only)  
- Error handling for invalid URLs or unavailable qualities  

---

## Screenshots

### Video Info Fetch
![Video Info Screenshot](./images/output1.PNG)

### Download Button & Quality Dropdown
![Download Screenshot](./images/output2.PNG)

*(Replace these with your actual screenshots)*

---

## Project Structure

```

YT-Downloader/
│
├─ Frontend/
│   ├─ index.html
│   ├─ style.css
│   └─ script.js
│
├─ backend/
│   └─ app.py
│
└─ README.md

````

---

## Local Setup Instructions

1. **Clone the repository:**

```bash
git clone https://github.com/mb-111-3/YT-Downloader.git
cd YT-Downloader/backend
````

2. **Create and activate a virtual environment:**

```bash
python -m venv venv
# Linux/Mac
source venv/bin/activate
# Windows
venv\Scripts\activate
```

3. **Install dependencies:**

```bash
pip install flask flask-cors pytube
```

4. **Run the backend:**

```bash
python app.py
```

* The backend will start at `http://127.0.0.1:5000`.

5. **Open the frontend:**

* Open `Frontend/index.html` in your browser.
* Make sure the `API` variable in `script.js` is set to:

```js
const API = "http://127.0.0.1:5000";
```

---

## Usage

1. Enter a valid YouTube video URL in the input field.
2. Click **Fetch Info** → video title, thumbnail, and available qualities will appear.
3. Select the desired quality from the dropdown.
4. Click **Download** to save the video locally.

---
