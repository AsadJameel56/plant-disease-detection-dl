import os
import json
import time
import numpy as np
import tensorflow as tf

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from io import BytesIO

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "plant_disease_model.keras")
CLASS_PATH = os.path.join(BASE_DIR, "class_names.json")

model = None
class_names = None


def load_model_files():
    global model, class_names

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file nahi mili: {MODEL_PATH}")

    if not os.path.exists(CLASS_PATH):
        raise FileNotFoundError(f"Class names file nahi mili: {CLASS_PATH}")

    model = tf.keras.models.load_model(MODEL_PATH)

    with open(CLASS_PATH, "r", encoding="utf-8") as file:
        class_names = json.load(file)

    print("AI model loaded successfully!", flush=True)
    print("Number of classes:", len(class_names), flush=True)


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Plant Disease Detection API is running"})


@app.route("/predict", methods=["POST"])
def predict():
    if model is None or class_names is None:
        return jsonify({"error": "Model is not loaded"}), 500

    if "file" not in request.files:
        return jsonify({"error": "Image file is required"}), 400

    uploaded_file = request.files["file"]

    try:
        image = Image.open(BytesIO(uploaded_file.read())).convert("RGB")
        image = image.resize((224, 224))

        # Model ke andar rescaling layer pehle se hai,
        # is liye pixels ko dobara normalize nahi karna.
        image_array = np.array(image, dtype=np.float32)
        image_array = np.expand_dims(image_array, axis=0)

        t = time.time()
        predictions = model(image_array, training=False).numpy()[0]
        print("predict seconds:", round(time.time() - t, 2), flush=True)

        top_indices = np.argsort(predictions)[::-1][:3]
        best_index = int(top_indices[0])

        top_predictions = [
            {
                "class_name": class_names[int(index)],
                "confidence": float(predictions[index]),
            }
            for index in top_indices
        ]

        return jsonify({
            "class_name": class_names[best_index],
            "confidence": float(predictions[best_index]),
            "top_predictions": top_predictions,
        })

    except Exception as error:
        app.logger.exception("Prediction failed")
        return jsonify({"error": f"Image prediction failed: {str(error)}"}), 500


load_model_files()

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)