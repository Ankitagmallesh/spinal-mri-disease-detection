"# NeuralCord — Spinal Cord MRI Diagnostic Pipeline · PRD

## Original Problem Statement
\"i want this app to work accurately for spinal cord disease mr image four class
labels such as tumor, ms lesions, injury and normal. If the mr image is tumor,
prediction should be tumor only — not other — and same with injury, ms lesion,
and normal. In tumor MRIs there are some broken parts that were being predicted
as MS lesions. Make the prediction accurate and give the complete working zip
file back.\"

## Architecture
- **Backend** (FastAPI · `/app/backend/server.py`): classical CV for the
  segmentation / mask / overlay panels + **GPT-4o vision LLM** (via
  `emergentintegrations`) for the actual 4-class classification. MongoDB-backed
  prediction history.
  - Endpoints: `/api/predict`, `/api/predictions`, `/api/predictions/{id}`,
    `/api/metrics`.
- **Frontend** (React · `/app/frontend/src/pages/Dashboard.js`): Swiss /
  high-contrast medical dashboard — upload, 4-panel viewer, classification card
  with radiological rationale, history, metrics, architecture.
- **Reference ML code** (`/app/ml/`): PyTorch U-Net + classifier (Dice + CE
  loss) for optional offline training.

## What's been implemented (Jan 2026)
- Replaced the rule-based Tumor/MS/Injury/Normal classifier with a GPT-4o
  vision call that receives the MRI image directly and returns a structured
  JSON `{predicted_class, confidence, probabilities, reasoning}`.
- Radiology system prompt with explicit decision rules disambiguating the
  previous tumor→MS misclassification (broken cord = Tumor, not MS).
- Added `reasoning` field end-to-end (backend model, DB persistence, frontend
  \"Radiological Rationale\" panel).
- Confidence threshold lowered from 95 → 85 (vision LLM rarely outputs 99+ for
  medical images).
- EMERGENT_LLM_KEY wired via `backend/.env` + `load_dotenv()`.
- Fixed a set of src/*.js + *.css files that were shipped with escaped/wrapped
  quoting so the frontend now compiles cleanly.
- 10/10 backend tests passing (testing subagent, iteration_1).

## Backlog / Next steps
- **P1**: NIfTI (.nii/.nii.gz) volume support with slice picker.
- **P1**: Download-as-PDF radiology report (image + rationale + probabilities).
- **P2**: Per-user auth + private history.
- **P2**: Swap in a trained U-Net checkpoint from `/app/ml/` when a labelled
  dataset is available.
- **P3**: Batch upload mode (multiple slices → aggregated finding).
"