// Turns a PlantVillage class name like "Tomato___Late_blight" into readable parts
// and attaches GENERAL guidance by disease type. This is educational, not a diagnosis.

export function parseLabel(label) {
  const [plantRaw = "", condRaw = ""] = label.split("___");
  const clean = (s) => s.replace(/_/g, " ").replace(/\s+/g, " ").replace(/,/g, ", ").trim();
  const condition = clean(condRaw) || "Unknown";
  return {
    plant: clean(plantRaw) || "Unknown plant",
    condition,
    healthy: /healthy/i.test(condition),
  };
}

const RULES = [
  { match: /healthy/i, about: "No signs of disease were detected in this leaf.",
    tips: ["Keep up regular watering and balanced feeding.", "Inspect plants weekly for early symptoms.", "Maintain good airflow between plants."] },
  { match: /late blight/i, about: "A fast-spreading disease (Phytophthora infestans) that thrives in cool, wet weather and causes dark, water-soaked lesions.",
    tips: ["Remove and destroy infected plants or leaves.", "Avoid overhead watering.", "Use a recommended fungicide and resistant varieties."] },
  { match: /early blight|northern leaf blight|leaf blight/i, about: "A fungal leaf disease causing brown lesions, often with ring-like or cigar-shaped patterns, that starts on older leaves.",
    tips: ["Remove affected leaves.", "Rotate crops each season.", "Water at the base and apply a suitable fungicide if it spreads."] },
  { match: /black rot|esca|measles/i, about: "A fungal disease that causes dark spots on leaves and can damage fruit and woody tissue.",
    tips: ["Prune and destroy infected material.", "Improve airflow in the canopy.", "Apply protective fungicide at the recommended growth stages."] },
  { match: /rust/i, about: "A fungal disease producing orange, yellow or rust-colored pustules on leaves.",
    tips: ["Remove heavily infected leaves.", "Avoid wetting foliage.", "Use resistant varieties and fungicide where needed."] },
  { match: /scab/i, about: "A fungal disease causing olive-green to dark scabby spots on leaves and fruit.",
    tips: ["Rake and dispose of fallen leaves.", "Prune for airflow.", "Apply fungicide early in the season."] },
  { match: /powdery mildew/i, about: "A fungal disease that shows as white, powdery patches on leaf surfaces.",
    tips: ["Improve airflow and reduce crowding.", "Avoid excess nitrogen fertilizer.", "Use sulfur-based or other labeled fungicides."] },
  { match: /leaf mold/i, about: "A fungal disease linked to high humidity, causing yellow patches on top and mold underneath leaves.",
    tips: ["Lower humidity and ventilate greenhouses.", "Space plants out.", "Remove infected leaves."] },
  { match: /spot|septoria|scorch/i, about: "A bacterial or fungal leaf disease that produces spots or scorched patches, spreading through splashing water.",
    tips: ["Remove infected leaves and avoid working with wet plants.", "Water at soil level.", "Rotate crops and use certified disease-free seed or plants."] },
  { match: /spider mite/i, about: "Tiny pests that suck sap, causing stippled, yellowing leaves and fine webbing.",
    tips: ["Rinse leaves with water to reduce mites.", "Encourage natural predators.", "Use miticide or insecticidal soap if infestation is heavy."] },
  { match: /virus|mosaic|curl/i, about: "A viral disease that causes mottled, curled or stunted leaves. It cannot be cured once the plant is infected.",
    tips: ["Remove and destroy infected plants.", "Control insect vectors such as whiteflies and aphids.", "Plant resistant varieties."] },
  { match: /haunglongbing|greening/i, about: "A serious bacterial citrus disease spread by psyllids, causing blotchy yellow leaves and misshapen fruit.",
    tips: ["Contact your local agricultural extension office.", "Control psyllid insects.", "Remove infected trees as advised locally."] },
];

export function getInfo({ condition }) {
  return (
    RULES.find((r) => r.match.test(condition)) || {
      about: "Condition detected by the model. Check with a local plant expert for confirmation.",
      tips: ["Isolate the plant if possible.", "Take clearer photos of several leaves.", "Consult a local agricultural expert."],
    }
  );
}
