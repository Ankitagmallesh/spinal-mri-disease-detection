"# NeuralCord — Spinal Cord MRI Diagnostic Pipeline

Automatic segmentation + 4-class classification (**Tumor · MS · Injury · Normal**)
of spinal-cord MRI slices using a **GPT-4o vision LLM** wrapped behind a FastAPI
backend and a React dashboard.

## Accuracy improvements (this build)

The previous build used a rule-based OpenCV classifier that frequently mis-labelled
tumor images (especially ones with a \"broken\"/discontinuous cord) as MS lesions.

This build replaces the classifier with a **GPT-4o vision model** guided by a
strict radiology prompt (`SYSTEM_PROMPT` in `backend/server.py`). The prompt
explicitly disambiguates the common failure modes:

- A focal mass, cord expansion, or cord discontinuity (\"broken\" cord) → **Tumor**
- Multiple small ovoid plaques with a preserved cord calibre → **MS**
- Vertebral fracture, malalignment, or post-traumatic edema → **Injury**
- Homogeneous intact cord → **Normal**

The classical OpenCV pipeline (CLAHE → Otsu → morphological ops →
connected-component extraction) is still used to produce the **four visualisation
panels** the dashboard renders (original, segmented cord, binary mask, and
disease overlay with lesion bounding boxes).

## Architecture

```
React (CRA + Tailwind + shadcn/ui)  ───►  FastAPI (Python)
      uploads PNG/JPG                        │
                                             ├── CLAHE + Otsu segmentation
                                             ├── Lesion detection (CV)
                                             └── GPT-4o vision classification
                                                     │
                                                     ▼
                                              MongoDB (history)
```

## Run locally

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pip install emergentintegrations --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/
# edit .env — set EMERGENT_LLM_KEY and MONGO_URL
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend

```bash
cd frontend
yarn install
yarn start  # http://localhost:3000
```

The frontend reads `REACT_APP_BACKEND_URL` from `frontend/.env`.

## Reference ML code (`/ml`)

Optional PyTorch U-Net + classifier training pipeline. Useful if you want to
train your own model on a labelled dataset instead of relying on the vision
LLM. See `ml/README.md`.

## API

| Method | Path                     | Purpose                              |
| ------ | ------------------------ | ------------------------------------ |
| GET    | `/api/`                  | Service metadata                     |
| POST   | `/api/predict`           | Upload MRI slice, get classification |
| GET    | `/api/predictions`       | List recent predictions              |
| GET    | `/api/predictions/{id}`  | Retrieve one prediction              |
| DELETE | `/api/predictions/{id}`  | Delete a prediction                  |
| GET    | `/api/metrics`           | Evaluation summary                   |

## Classes

| Class   | Colour  | Typical findings                                |
| ------- | ------- | ----------------------------------------------- |
| Tumor   | Red     | Focal cord mass, expansion, cord discontinuity  |
| MS      | Blue    | Multiple small ovoid plaques, cord calibre normal |
| Injury  | Orange  | Vertebral fracture, contusion, trauma pattern   |
| Normal  | Green   | Homogeneous, intact cord                        |

## ⚠️ Research preview — not a medical device.
"