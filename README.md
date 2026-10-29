# LeafGuard — Plant Disease Detection Using Deep Learning

LeafGuard is a web-based plant disease classification project built using **MobileNetV2**, **TensorFlow**, **React**, and **Flask**. It predicts a plant-leaf class from an uploaded image.

## Project Results

- **Dataset:** PlantVillage
- **Dataset library:** TensorFlow Datasets (TFDS)
- **Dataset identifier:** `plant_village`
- **Number of classes:** 38
- **Model:** MobileNetV2
- **Test accuracy:** 96.28%
- **Test loss:** 0.1199
- **Training environment:** Google Colab

## Dataset

The dataset is loaded through TensorFlow Datasets using the `plant_village` identifier. The notebook uses an 80% training split, 10% validation split, and 10% testing split.

- [PlantVillage dataset documentation](https://www.tensorflow.org/datasets/catalog/plant_village)
- [TensorFlow Datasets documentation](https://www.tensorflow.org/datasets/overview)

## Live Demo

- **Frontend:** https://plant-disease-detection-dl-git-master-zoltex.vercel.app/
- **Backend API:** https://plant-disease-api-gv2p.onrender.com

Upload a plant-leaf image on the website to test the model prediction.

## Model and Source Code

This project uses a trained MobileNetV2-based model with 38 output classes. The backend loads the saved model and class labels to make predictions.

The repository should include the source code, model weights or a stable model download link, `class_names.json`, dependency files, and setup instructions. Check that these files are publicly accessible before submission.

## Application Architecture

- **Frontend:** React + Vite
- **Backend:** Flask + Flask-CORS
- **Deep learning:** TensorFlow / Keras
- **Deployment:** Vercel frontend and Render backend

## Flask API Contract

The frontend sends a `POST` request to `/predict` using multipart form data with the field name `file`. The API returns the predicted class and confidence information.

## Run the Frontend Locally

```bash
npm install
cp .env.example .env
npm run dev
```

Configure `VITE_API_URL` in `.env` to point to the Flask backend. On Windows Command Prompt, create or edit `.env` manually if the `cp` command is unavailable.

## Project Resources

- **Project Report:** Add the final report link here.
- **Presentation:** Add the final PPT link here.
- **YouTube Presentation Video:** Add the uploaded video link here.
- **LinkedIn Project Post:** Add the published post link here.
- **Colab Training Notebook:** https://colab.research.google.com/drive/17rfb4UW7JPYKz23R-Car4oxZlgoh-Y0d

## Limitations

Predictions may be affected by lighting, image quality, background variation, and differences between dataset images and real-world plant photographs. Results should be verified by an agricultural expert before making treatment decisions.
