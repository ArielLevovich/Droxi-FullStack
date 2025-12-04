export enum Gender {
    Male = 'Male',
    Female = 'Female',
}
export interface Measurement {
    value: string;
    units: string;
    date: Date;
}
export interface Condition {
    code: string;
    name: string;
}
export interface Diagnosis {
    id: string;
    condition: Condition;
    diagnosedSince: Date;
    stillActive: boolean;
}
export interface Allergy {
    code: string;
    name: string;
    reaction: string;
}
export interface Visit {
    id: string;
    date: Date;
    clinician: string;
    shortDescription: string;
    longDescription: string;
}
export interface PatientProfile {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: Gender;
    height: Measurement;
    weight: Measurement;
    bmiIndex: Measurement;
    race: string;
    diagnoses: Diagnosis[];
    allergies: Allergy[];
    activePrescriptions: Prescription[];
    patientRecord: string; //HTML file
}
export interface LabTest {
    code: string;
    name: string;
    units: string;
    minValue?: number;
    maxValue?: number;
    referenceRange?: string; //show text instead of min and max
}
export interface LabResult {
    id: string;
    measurement: Measurement;
    isAbnormal?: boolean;
}
export interface LabTestMeasurements {
    measurements: LabResult[];
    labTest: LabTest;
}
export interface Dosage {
    amount: number; //850
    units: string; //mg
    frequency: number; // twice (2)
    period: number; // number of days
    totalDays: number;
    sig: string;
    refillCount: number;
    daysSupply: number;
}
export interface Medication {
    code: string;
    name: string;
    activeIngredient: string;
    route: string; // oral,injection etc.
    schedule: number;
    isPrescribable: boolean;
    ingredientCodes: string[];
    isGeneric: boolean;
}
export interface Prescription {
    id: string;
    patientName: string;
    medication: Medication;
    isChronic: boolean;
    dosage: Dosage;
    initiatorCategory: string;
}
export interface RefillRequest extends Prescription {
    origin: string;
    relevantVisits: Visit[];
    labs: LabTestMeasurements[];
    drugInteractions: Medication[];
    conditionInteractions: Diagnosis[];
    firstPrescribed?: { clinician: string; date: Date };
    lastPrescribed?: { clinician: string; date: Date };
    isAlert: boolean;
    riskLevel: number;
    isRenewChecked: boolean;
}
export interface PatientProfileToSend {
    id: string;
    ehrPatientId: string;
    name: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    age: number;
    gender: Gender;
    height: Measurement;
    weight: Measurement;
    bmiIndex: Measurement;
    race: string;
    diagnoses: Diagnosis[];
    allergies: Allergy[];
    activePrescriptions: Prescription[];
    isActiveMedicationsAvailable: boolean;
    isSmsConsent: boolean;
    isPortalRegistered: boolean;
}
export interface Recommendation {
    recommendationValue: string; // 'yes', 'no', 'unknown'
    recommendationDescription: string;
}
export interface PatientRequest {
    id: string;
    requestDate: Date;
    prescriptions: RefillRequest[];
    patient: PatientProfileToSend;
    labs?: LabTestMeasurements[];
    visits?: Visit[];
    priority?: 'high' | 'medium' | 'regular';
    recommendation: Recommendation;
    description?: string;
    isRead: boolean;
    isUrgent: boolean;
    estimatedTimeSec: number;
    assignment: { assignDate: Date; assignedTo: string };
}
export interface RenewalRequest extends PatientRequest {
    type: 'renewal';
}
