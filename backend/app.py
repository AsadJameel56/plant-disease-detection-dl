import os
import json
import time
import threading
import numpy as np

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from io import BytesIO

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "plant_disease_model.keras")
CLASS_PATH = os.path.join(BASE_DIR, "class_names.json")

_model = None
_class_names = None
_lock = threading.Lock()


def get_model():
    """TensorFlow ko worker ke andar hi load karo (fork ke baad)."""
    global _model, _class_names
    if _model is None:
        with _lock:
            if _model is None:
                t = time.time()
                import tensorflow as tf  # yahan import, file ke upar nahi

                if not os.path.exists(MODEL_PATH):
                    raise FileNotFoundError(f"Model file nahi mili: {MODEL_PATH}")
                if not os.path.exists(CLASS_PATH):
                    raise FileNotFoundError(f"Class names file nahi mili: {CLASS_PATH}")

                model = tf.keras.models.load_model(MODEL_PATH)
                with open(CLASS_PATH, "r", encoding="utf-8") as f:
                    names = json.load(f)

                _class_names = names
                _model = model
                print("Model loaded in", round(time.time() - t, 1), "s", flush=True)
    return _model, _class_names


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Plant Disease Detection API is running"})


@app.route("/warmup", methods=["GET"])
def warmup():
    get_model()
    return jsonify({"status": "ready"})


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "Image file is required"}), 400

    uploaded_file = request.files["file"]

    try:
        print("predict: request received", flush=True)
        model, class_names = get_model()

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


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)