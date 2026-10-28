# Plant Disease Detection Using Deep Learning

## Project Overview
This project uses TensorFlow and MobileNetV2 transfer learning to classify plant leaf images into 38 plant health and disease categories from the PlantVillage dataset.

## Technologies
- Python
- TensorFlow / Keras
- MobileNetV2
- Google Colab

## Dataset
PlantVillage dataset:
https://www.tensorflow.org/datasets/catalog/plant_village

## Model
- Input image size: 224 × 224 pixels
- Number of classes: 38
- Architecture: MobileNetV2 with a classification head
- Saved model: `model/plant_disease_model.keras`
- Class labels: `model/class_names.json`

## Test Results
- Test accuracy: 96.28%
- Test loss: 0.1199

These results are from the current experiment and should be interpreted in the context of the dataset and test split.

## Project Files
- `model/plant_disease_model.keras` — trained model
- `model/class_names.json` — class labels in prediction order

## Limitations
The model was evaluated on the PlantVillage dataset. Real-world images may produce different results, and predictions should not be treated as guaranteed agricultural diagnoses.

## Project Links
- GitHub: [Add repository URL]
- Live Demo: [Add Vercel URL when deployed]
- Presentation Video: [Add YouTube URL when available]
- Project Report: [Add report link when available]
