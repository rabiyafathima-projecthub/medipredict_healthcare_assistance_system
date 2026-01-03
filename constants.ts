import { Disease, Severity, PredictionResult } from './types';

// This simulates the "Trained ML Model" dataset. 
// In a real python backend, this would be a classification model.
export const DISEASES_DATABASE: Disease[] = [
  {
    id: 'typhoid',
    name: 'Typhoid Fever',
    symptoms: ['high fever', 'headache', 'stomach pain', 'weakness', 'vomiting', 'loose stools'],
    severity: Severity.MODERATE,
    description: 'A bacterial infection that can spread throughout the body, affecting many organs.',
    healthTips: [
      'Drink plenty of fluids to stay hydrated.',
      'Eat small, frequent meals.',
      'Avoid raw fruits and vegetables that cannot be peeled.',
      'Rest properly and take prescribed antibiotics.'
    ]
  },
  {
    id: 'dengue',
    name: 'Dengue Fever',
    symptoms: ['high fever', 'severe headache', 'pain behind eyes', 'joint pain', 'muscle pain', 'rash', 'nausea'],
    severity: Severity.HIGH,
    description: 'A mosquito-borne viral infection causing severe flu-like illness.',
    healthTips: [
      'Use mosquito repellents and nets.',
      'Keep hydrated with electrolytes.',
      'Take paracetamol for fever (avoid aspirin/ibuprofen).',
      'Monitor platelet count regularly.'
    ]
  },
  {
    id: 'malaria',
    name: 'Malaria',
    symptoms: ['fever', 'chills', 'sweating', 'headache', 'nausea', 'vomiting', 'muscle pain'],
    severity: Severity.HIGH,
    description: 'A disease caused by a plasmodium parasite, transmitted by the bite of infected mosquitoes.',
    healthTips: [
      'Sleep under insecticide-treated mosquito nets.',
      'Wear long-sleeved clothing.',
      'Take antimalarial medication as prescribed.',
      'Seek immediate medical attention for high fever.'
    ]
  },
  {
    id: 'kidney_stone',
    name: 'Kidney Stone',
    symptoms: ['severe pain in back', 'pain in side', 'blood in urine', 'nausea', 'vomiting', 'fever', 'chills', 'frequent urination'],
    severity: Severity.MODERATE,
    description: 'Hard deposits made of minerals and salts that form inside your kidneys.',
    healthTips: [
      'Drink 2-3 liters of water daily.',
      'Limit sodium (salt) intake.',
      'Eat fewer oxalate-rich foods (spinach, rhubarb).',
      'Eat moderate amounts of protein.'
    ]
  },
  {
    id: 'heart_disease',
    name: 'Heart Disease (Cardiovascular)',
    symptoms: ['chest pain', 'shortness of breath', 'pain in neck', 'pain in jaw', 'pain in back', 'numbness in arm', 'weakness'],
    severity: Severity.CRITICAL,
    description: 'Conditions that involve narrowed or blocked blood vessels that can lead to a heart attack.',
    healthTips: [
      'Immediate medical attention is required.',
      'Adopt a heart-healthy diet low in saturated fats.',
      'Exercise regularly if approved by a doctor.',
      'Stop smoking and limit alcohol.'
    ]
  },
  {
    id: 'migraine',
    name: 'Migraine',
    symptoms: ['severe headache', 'throbbing pain', 'sensitivity to light', 'sensitivity to sound', 'nausea', 'vomiting'],
    severity: Severity.LOW,
    description: 'A neurological condition that can cause multiple symptoms, primarily intense headaches.',
    healthTips: [
      'Rest in a quiet, dark room.',
      'Apply a cold compress to your head or neck.',
      'Stay hydrated.',
      'Maintain a regular sleep schedule.'
    ]
  },
  {
    id: 'common_cold',
    name: 'Common Cold',
    symptoms: ['runny nose', 'sore throat', 'cough', 'congestion', 'sneezing', 'low fever'],
    severity: Severity.LOW,
    description: 'A viral infection of your nose and throat (upper respiratory tract).',
    healthTips: [
      'Stay hydrated.',
      'Rest.',
      'Soothe a sore throat with gargling.',
      'Relieve pain with OTC medications.'
    ]
  }
];

// Extract unique symptoms for the UI
export const ALL_SYMPTOMS = Array.from(
  new Set(DISEASES_DATABASE.flatMap(d => d.symptoms))
).sort();

// ML Algorithm Simulation
export const predictDisease = (selectedSymptoms: string[]): PredictionResult | null => {
  if (selectedSymptoms.length === 0) return null;

  let bestMatch: Disease | null = null;
  let highestScore = 0;

  DISEASES_DATABASE.forEach(disease => {
    // Intersection of user symptoms and disease symptoms
    const matchCount = disease.symptoms.filter(s => selectedSymptoms.includes(s)).length;
    
    // Score calculation: How many of the disease's symptoms does the user have?
    // Weighted slightly by the ratio of matched symptoms to total symptoms selected
    const score = matchCount / disease.symptoms.length;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = disease;
    }
  });

  // Threshold for a valid prediction
  if (highestScore > 0.2 && bestMatch) {
    return {
      disease: bestMatch,
      confidence: Math.round(highestScore * 100)
    };
  }

  return null;
};