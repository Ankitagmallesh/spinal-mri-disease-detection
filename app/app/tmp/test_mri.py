"""
Generate synthetic test images for each class and validate API responses.
"""

import os
import cv2
import numpy as np
import requests

# Config
OUTPUT_DIR = "/tmp/mri_tests"
API_URL = "http://localhost:8001/api/predict"
H, W = 256, 256

os.makedirs(OUTPUT_DIR, exist_ok=True)


def base_mri(seed=0):
    """
    Create a synthetic MRI-like image:
    - Dark background
    - Soft tissue circular region
    - Bright vertical spinal cord
    """
    rng = np.random.default_rng(seed)

    # Background noise
    bg = rng.normal(6, 4, (H, W)).clip(0, 30).astype(np.uint8)
    img = bg.copy()

    # Soft tissue
    tissue = rng.normal(40, 14, (H, W)).clip(0, 120).astype(np.uint8)

    yy, xx = np.ogrid[:H, :W]

    # Body mask (circular)
    body = ((xx - W / 2) ** 2 + (yy - H / 2) ** 2) < (H * 0.45) ** 2
    img[body] = tissue[body]

    # Spinal cord (vertical ellipse)
    cord = (
        (xx - W / 2) ** 2 / (W * 0.04) ** 2
        + (yy - H / 2) ** 2 / (H * 0.40) ** 2
    ) < 1

    noise = rng.integers(-15, 15, (H, W)).astype(np.int16)
    img[cord] = np.clip(190 + noise[cord], 0, 255)

    return img.astype(np.uint8), cord


def save_image(name, img):
    path = os.path.join(OUTPUT_DIR, name)
    cv2.imwrite(path, img)


def save_normal():
    img, _ = base_mri(1)
    save_image("normal.png", img)


def save_tumor():
    img, cord = base_mri(2)

    yy, xx = np.ogrid[:H, :W]
    mass = ((xx - W / 2) ** 2 / 12**2 + (yy - H / 2 + 10) ** 2 / 20**2) < 1
    img[mass & cord] = 60

    save_image("tumor.png", img)


def save_ms():
    img, cord = base_mri(3)

    yy, xx = np.ogrid[:H, :W]
    for cy in [-50, -20, 10, 40, 70]:
        plaque = ((xx - W / 2) ** 2 / 4**2 + (yy - H / 2 - cy) ** 2 / 6**2) < 1
        img[plaque & cord] = 240

    save_image("ms.png", img)


def save_injury():
    img, cord = base_mri(4)

    yy, xx = np.ogrid[:H, :W]

    # Dent (cord deformity)
    dent = ((xx - W / 2 - 8) ** 2 / 5**2 + (yy - H / 2 - 20) ** 2 / 25**2) < 1
    img[dent & cord] = 10

    # Edema (elongated bright region)
    edema = ((xx - W / 2) ** 2 / 3**2 + (yy - H / 2 - 10) ** 2 / 35**2) < 1
    img[edema & cord] = 230

    save_image("injury.png", img)


def save_not_mri_photo():
    rng = np.random.default_rng(9)

    img = rng.integers(40, 220, (H, W, 3), dtype=np.uint8)

    # Add gradient
    img[..., 0] = np.linspace(30, 200, W).astype(np.uint8)
    img[..., 1] = np.linspace(200, 30, W).astype(np.uint8)

    save_image("photo.png", img)


def save_not_mri_document():
    img = np.full((H, W, 3), 240, dtype=np.uint8)

    cv2.putText(
        img,
        "HELLO",
        (40, 140),
        cv2.FONT_HERSHEY_SIMPLEX,
        3,
        (20, 20, 20),
        6,
    )

    save_image("document.png", img)


def run_tests():
    print("=== TEST RESULTS ===")

    test_files = [
        "normal.png",
        "tumor.png",
        "ms.png",
        "injury.png",
        "photo.png",
        "document.png",
    ]

    for name in test_files:
        path = os.path.join(OUTPUT_DIR, name)

        with open(path, "rb") as f:
            response = requests.post(
                API_URL,
                files={"file": (name, f, "image/png")},
            )

        try:
            data = response.json()
        except Exception:
            data = response.text

        if response.status_code == 200:
            print(
                f"[{response.status_code}] {name:<14} -> "
                f"{data['predicted_class']:<7} "
                f"conf={data['confidence']:.1f}% "
                f"lesions={data['lesion_count']} "
                f"reason={data['reasoning'][:80]}"
            )
        else:
            detail = data.get("detail", data) if isinstance(data, dict) else data
            print(f"[{response.status_code}] {name:<14} REJECTED -> {str(detail)[:100]}")


if __name__ == "__main__":
    save_normal()
    save_tumor()
    save_ms()
    save_injury()
    save_not_mri_photo()
    save_not_mri_document()

    run_tests()