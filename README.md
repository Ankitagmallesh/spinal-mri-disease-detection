# NeuralCord — Spinal Cord MRI Diagnostic Pipeline

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)
![GPT-4 Vision](https://img.shields.io/badge/OpenAI-GPT--4o--Vision-412991.svg?style=flat&logo=openai&logoColor=white)

NeuralCord is a comprehensive AI-powered diagnostic pipeline for Spinal Cord MRI classification. It accurately predicts four class labels: **Tumor, MS Lesions, Injury, and Normal**. 

By leveraging classical Computer Vision alongside **GPT-4o Vision LLMs**, NeuralCord resolves complex edge cases (e.g., distinguishing broken cord structures in tumors from MS lesions), delivering highly accurate predictions along with explicitly stated radiological rationale.

## 🚀 Features

- **4-Class Prediction:** High-accuracy classification of MR images into Tumor, MS Lesions, Injury, or Normal.
- **Multimodal AI Architecture:** 
  - **Vision LLM:** GPT-4o Vision directly analyzes the MRI image to output a structured prediction, confidence score, and detailed clinical reasoning.
  - **Classical CV:** Computes segmentation masks, extracts the spinal cord, and overlays anomaly highlights for visual validation.
- **Premium Medical UI:** A sleek, dark "glassmorphism" React dashboard featuring:
  - Drag-and-drop MRI image upload
  - 4-Panel viewer (Original, Segmented Cord, Binary Mask, Disease Overlay)
  - Real-time classification card with diagnostic rationale
  - Interactive prediction history and metrics visualization
- **Persistent Database:** MongoDB-backed history allows you to revisit past predictions.

## 🛠️ Technology Stack

- **Frontend:** React, Vanilla CSS (Premium Dark UI), Lucide Icons
- **Backend:** FastAPI, Python, OpenCV (Image Processing)
- **AI/ML:** GPT-4o Vision API (via `emergentintegrations`), PyTorch (U-Net Architecture Reference)
- **Database:** MongoDB

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- MongoDB (Running locally or via Atlas)
- emergentintegrations / OpenAI API Key

### 1. Clone the repository
```bash
git clone https://github.com/Ankitagmallesh/spinal-mri-disease-detection.git
cd spinal-mri-disease-detection
```

### 2. Backend Setup
```bash
cd app/app/backend
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt

# Create a .env file and add your keys
echo "EMERGENT_LLM_KEY=your_api_key_here" > .env
echo "MONGO_URI=mongodb://localhost:27017" >> .env

# Run the FastAPI server
uvicorn server:app --reload --port 8000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd app/app/frontend
npm install

# Start the React development server
npm run dev
```

The frontend will be available at `http://localhost:3000` (or `http://localhost:5173` depending on the bundler).

## 🧠 Architecture Overview

1. **Upload & Preprocessing:** User uploads an MRI slice. The backend applies CLAHE (Contrast Limited Adaptive Histogram Equalization) and classical thresholding to extract the cord mask.
2. **Vision LLM Inference:** The raw image is base64-encoded and passed to the GPT-4o Vision model along with a strict radiological prompt.
3. **Reasoning & Classification:** The model evaluates the image, disambiguates edge cases (like broken parts in tumors), and returns a JSON payload with probabilities and clinical rationale.
4. **Presentation:** The frontend renders the 4-panel visualizer and displays the model's reasoning in a premium, high-contrast dashboard.

## 🔜 Roadmap
- **P1:** NIfTI (`.nii`/`.nii.gz`) volume support with interactive slice picker.
- **P1:** Download-as-PDF radiology report generation.
- **P2:** Per-user authentication and private prediction history.
- **P2:** Swap in a fully trained offline PyTorch U-Net checkpoint.
- **P3:** Batch upload mode.

## 📄 License
This project is licensed under the MIT License.
