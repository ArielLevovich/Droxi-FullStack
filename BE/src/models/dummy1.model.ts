import {
    Diagnosis,
    Gender,
    LabTest,
    LabTestMeasurements,
    Medication,
    PatientProfileToSend,
    Prescription,
    RefillRequest,
    RenewalRequest,
    Visit,
} from '../request/request.inteface';

const metformin: Medication = {
    code: '111',
    name: 'Metformin',
    activeIngredient: 'metformin hydrochloride',
    route: 'oral',
    schedule: 0,
    isPrescribable: true,
    ingredientCodes: ['6809'],
    isGeneric: true,
};
const firstVisit: Visit = {
    id: 'firstVisit',
    date: new Date(2022, 1, 10),
    clinician: 'Doctor Suss',
    shortDescription: 'Blah blah',
    longDescription: 'This is a random visit',
};
const someVisit: Visit = {
    id: 'someVisit',
    date: new Date(2019, 5, 18),
    clinician: 'Doctor Suss',
    shortDescription: 'nonsense',
    longDescription: 'This is some visit',
};
const some2Visit: Visit = {
    id: 'some2Visit',
    date: new Date(2019, 5, 19),
    clinician: 'Doctor Suss',
    shortDescription: 'nonsense2',
    longDescription: 'This is some 2 visit',
};
const some3Visit: Visit = {
    id: 'some3Visit',
    date: new Date(2019, 5, 20),
    clinician: 'Doctor Suss',
    shortDescription: 'nonsense3',
    longDescription: 'This is some 3 visit',
};
const randomVisit: Visit = {
    id: 'randomVisit2',
    date: new Date(2022, 1, 10),
    clinician: 'Doctor Suss',
    shortDescription: 'Blah blah 2',
    longDescription: 'This is a random visit 2',
};
const alamlodipine: Medication = {
    code: '98765',
    name: 'Amlodipine',
    activeIngredient: 'Amlodipine',
    route: 'tablet',
    isPrescribable: true,
    ingredientCodes: ['17767'],
    isGeneric: true,
    schedule: 0,
};
const metforminPrescription: Prescription = {
    id: '12',
    patientName: 'Power Puf',
    initiatorCategory: 'patient',
    medication: metformin,
    isChronic: true,
    dosage: {
        sig: 'Take 1000 mg every day for a year',
        amount: 1000,
        units: 'mg',
        frequency: 1,
        period: 1,
        refillCount: 4,
        daysSupply: 73,
        totalDays: 365,
    },
};
const amlodipinePrescription: Prescription = {
    id: '13',
    patientName: 'Power Puf',
    initiatorCategory: 'patient',
    medication: alamlodipine,
    isChronic: true,
    dosage: {
        sig: 'Take 1 tablet every day',
        amount: 2.5,
        units: 'mg',
        frequency: 1,
        period: 1,
        refillCount: 4,
        daysSupply: 73,
        totalDays: 365,
    },
};

export const medicationConflicts: Prescription[] = [amlodipinePrescription];

const diabetes: Diagnosis = {
    id: '3333',
    condition: { code: '1', name: 'Diabetes' },
    diagnosedSince: new Date(2008, 4, 3),
    stillActive: true,
};
const highBloodPressure: Diagnosis = {
    id: '44440',
    condition: { code: '2', name: 'High Blood Pressure' },
    diagnosedSince: new Date(2013, 10, 27),
    stillActive: true,
};
export const diagnosesConflicts: Diagnosis[] = [highBloodPressure];

const altTest: LabTest = {
    code: '1234',
    name: 'ALT',
    units: 'U/L',
    minValue: 7,
    maxValue: 55,
};
export const altResult: LabTestMeasurements = {
    measurements: [
        {
            id: 'ooo',
            measurement: {
                value: '4',
                units: 'U/L',
                date: new Date(2022, 1, 15),
            },
            isAbnormal: true,
        },
    ],
    labTest: altTest,
};
const astTest: LabTest = {
    code: '1235',
    name: 'AST',
    units: 'U/L',
    minValue: 48,
    maxValue: 55,
};

const cmvTest: LabTest = {
    code: '123577',
    name: 'CMV Ab IgG',
    units: 'U/L',
    referenceRange: 'Negative: <12 U/ml | Equivocal 12-14 U/ml | Positive: >=14 U/ml',
};
export const cmvResult: LabTestMeasurements = {
    measurements: [
        {
            id: 'ggg',
            measurement: {
                value: 'Negative 5.0>',
                units: 'U/L',
                date: new Date(2022, 4, 10),
            },
            isAbnormal: false,
        },
        {
            id: 'hhh',
            measurement: {
                value: 'Positive 16.0<',
                units: 'U/L',
                date: new Date(2022, 4, 10),
            },
            isAbnormal: true,
        },
    ],
    labTest: cmvTest,
};

export const astResult: LabTestMeasurements = {
    measurements: [
        {
            id: 'kkk',
            measurement: {
                value: '49',
                units: 'U/L',
                date: new Date(2021, 11, 20),
            },
            isAbnormal: false,
        },
        {
            id: 'jjj',
            measurement: {
                value: '60',
                units: 'U/L',
                date: new Date(2020, 11, 20),
            },
            isAbnormal: true,
        },
        {
            id: 'uuu',
            measurement: {
                value: '49',
                units: 'U/L',
                date: new Date(2020, 11, 16),
            },
            isAbnormal: false,
        },
        {
            id: 'iii',
            measurement: {
                value: '47',
                units: 'U/L',
                date: new Date(2020, 11, 9),
            },
            isAbnormal: true,
        },
    ],
    labTest: astTest,
};
const fastingGlucoseTest: LabTest = {
    code: '1236',
    name: 'Fasting Glucose',
    units: 'mg/dL',
    minValue: 0,
    maxValue: 140,
};
export const fastingGlucoseResult: LabTestMeasurements = {
    measurements: [
        {
            id: 'qqq',
            measurement: {
                value: '80',
                units: 'mg/dL',
                date: new Date(2021, 10, 5),
            },
            isAbnormal: false,
        },
        {
            id: 'ppp',
            measurement: {
                value: '150',
                units: 'mg/dL',
                date: new Date(2018, 10, 5),
            },
            isAbnormal: true,
        },
        {
            id: 'fff',
            measurement: {
                value: '95',
                units: 'mg/dL',
                date: new Date(2017, 10, 5),
            },
            isAbnormal: false,
        },
    ],
    labTest: fastingGlucoseTest,
};
const metforminRequest: RefillRequest = {
    id: '12',
    patientName: 'Power Puf',
    initiatorCategory: 'patient',
    origin: 'EHR',
    medication: metformin,
    isChronic: true,
    dosage: {
        sig: 'Take 1000 mg every day for a year',
        amount: 1000,
        units: 'mg',
        frequency: 1,
        period: 1,
        refillCount: 4,
        daysSupply: 73,
        totalDays: 365,
    },
    relevantVisits: [firstVisit, randomVisit],
    labs: [altResult, astResult],
    drugInteractions: [metforminPrescription.medication],
    conditionInteractions: [highBloodPressure],
    firstPrescribed: { clinician: firstVisit.clinician, date: firstVisit.date },
    lastPrescribed: {
        clinician: randomVisit.clinician,
        date: randomVisit.date,
    },
    isAlert: true,
    riskLevel: 0,
    isRenewChecked: true,
};
const amlodipineRequest: RefillRequest = {
    id: '13',
    patientName: 'Power Puf',
    initiatorCategory: 'patient',
    origin: 'EHR',
    medication: alamlodipine,
    isChronic: true,
    dosage: {
        sig: 'Take 1 tablet every day',
        amount: 2.5,
        units: 'mg',
        frequency: 1,
        period: 1,
        refillCount: 4,
        daysSupply: 73,
        totalDays: 365,
    },
    relevantVisits: [firstVisit],
    labs: [cmvResult],
    drugInteractions: [],
    conditionInteractions: [],
    isAlert: false,
    riskLevel: 0,
    isRenewChecked: true,
};

export const patientToSend: PatientProfileToSend = {
    id: '12345',
    name: 'Power Puf',
    firstName: 'Power',
    lastName: 'Puf',
    ehrPatientId: '12345',
    birthDate: new Date(new Date().getFullYear() - 57, 3, 2),
    age: 57,
    gender: Gender.Female,
    height: { value: '170', units: 'cm', date: new Date(2000, 3, 28) },
    weight: { value: '65', units: 'Kg', date: new Date(2000, 3, 28) },
    bmiIndex: { value: '20', units: '', date: new Date(2000, 3, 28) },
    race: 'Jewish',
    diagnoses: [highBloodPressure, diabetes],
    allergies: [
        { code: '1', name: 'Peanut Allergy', reaction: 'Anaphylaxis' },
        { code: '3', name: 'Aspirin', reaction: 'Itchy rashes' },
    ],
    activePrescriptions: [metforminPrescription],
    isActiveMedicationsAvailable: true,
    isSmsConsent: true,
    isPortalRegistered: true,
};
export const request = [
    {
        type: 'renewal',
        id: '1',
        status: 'new',
        isRead: false,
        patientName: 'John Smith',
        requestDate: '2025-06-08T00:00:00.000Z',
        lastModifiedDate: '2025-06-08T11:01:47.567Z',
        description: '[06/08/25] refull; [12/12/24] refill for me',
        estimatedTimeSec: 151,
        assignment: {
            assignDate: '2025-06-08T11:01:47.567Z',
            assignedTo: 'Dr. Johnson',
            grouping: 'DEFAULT_GROUPING',
        },
        isUrgent: false,
        prescriptionIds: [],
        recommendation: {
            recommendationValue: 'unknown',
            recommendationDescription: 'System has low recommendation confidence.',
        },
    },
    {
        type: 'freeText',
        id: '2',
        status: 'new',
        isRead: true,
        patientName: 'Mary Davis',
        requestDate: '2025-06-08T00:00:00.000Z',
        lastModifiedDate: '2025-06-08T09:41:33.619Z',
        description: '[06/08/25] response earlier',
        estimatedTimeSec: 167,
        assignment: {
            assignDate: '2025-06-08T09:41:33.619Z',
            assignedTo: 'Dr. Johnson',
        },
        isUrgent: false,
        labels: ['Rx'],
    },
    {
        type: 'labReport',
        id: '3',
        status: 'new',
        isRead: true,
        patientName: 'Marina Green',
        requestDate: '2025-06-05T00:00:00.000Z',
        lastModifiedDate: '2025-06-05T14:03:19.000Z',
        description: '2 lab reports',
        estimatedTimeSec: 60,
        assignment: {
            assignDate: '2025-06-05T13:32:35.989Z',
            assignedTo: 'Dr. Johnson',
            grouping: 'DEFAULT_GROUPING',
        },
        isUrgent: false,
        abnormalResults: [],
        panels: ['CBC w/ auto diff', 'CBC w/ auto diff'],
    },
    {
        type: 'freeText',
        id: '4',
        status: 'new',
        isRead: true,
        patientName: 'Silver Cat',
        requestDate: '2025-06-05T00:00:00.000Z',
        lastModifiedDate: '2025-06-05T13:31:30.000Z',
        description: '[06/05/25] ref;\n[05/26/25] Sanity refill;\n[05/22/25] i need a refill ASAP',
        estimatedTimeSec: 1863,
        assignment: {
            assignDate: '2025-05-26T13:31:51.298Z',
            assignedTo: 'Dr. Johnson',
            grouping: 'DEFAULT_GROUPING',
        },
        isUrgent: false,
        prescriptionIds: [],
        recommendation: {
            recommendationValue: 'unknown',
            recommendationDescription: 'System has low recommendation confidence.',
        },
    },
    {
        type: 'labReport',
        id: '5',
        status: 'new',
        isRead: true,
        patientName: 'Maiya Olson',
        requestDate: '2025-05-27T00:00:00.000Z',
        lastModifiedDate: '2025-05-27T11:37:28.000Z',
        description: '2 lab reports',
        estimatedTimeSec: 60,
        assignment: {
            assignDate: '2025-05-26T08:48:28.149Z',
            assignedTo: 'Dr. Johnson',
            grouping: 'DEFAULT_GROUPING',
        },
        isUrgent: false,
        abnormalResults: [],
        panels: ['HbA1c (hemoglobin A1c), blood', 'HbA1c (hemoglobin A1c), blood'],
    },

    {
        type: 'freeText',
        id: '6',
        status: 'new',
        isRead: true,
        patientName: 'Brando Goods',
        requestDate: '2025-05-22T00:00:00.000Z',
        lastModifiedDate: '2025-05-22T13:41:21.528Z',
        description: '[05/22/25] refill',
        estimatedTimeSec: 58,
        assignment: {
            assignDate: '2025-05-22T13:41:21.528Z',
            assignedTo: 'Dr. Johnson',
            grouping: 'DEFAULT_GROUPING',
        },
        isUrgent: false,
        prescriptionIds: ['a-1959307.historicalmedrequest-12782'],
        recommendation: {
            recommendationValue: 'unknown',
            recommendationDescription: 'System has low recommendation confidence.',
        },
    },
    {
        type: 'freeText',
        id: '7',
        status: 'new',
        isRead: true,
        patientName: 'Marcia Henderson',
        requestDate: '2025-05-22T00:00:00.000Z',
        lastModifiedDate: '2025-05-22T12:41:19.942Z',
        description: '[05/22/25] devices',
        estimatedTimeSec: 139,
        assignment: {
            assignDate: '2025-05-22T12:41:19.942Z',
            assignedTo: 'Dr. Johnson',
            grouping: 'DEFAULT_GROUPING',
        },
        isUrgent: false,
        prescriptionIds: [],
        recommendation: {
            recommendationValue: 'unknown',
            recommendationDescription: 'System has low recommendation confidence.',
        },
    },
    {
        type: 'freeText',
        id: '8',
        status: 'new',
        isRead: true,
        patientName: 'Dawson Walker',
        requestDate: '2025-05-21T00:00:00.000Z',
        lastModifiedDate: '2025-05-22T05:22:45.541Z',
        description: '[05/21/25] Question Regarding Ongoing Issue – Requesting Review',
        estimatedTimeSec: 74,
        assignment: {
            assignDate: '2025-05-22T05:22:45.541Z',
            assignedTo: 'Dr. Johnson',
        },
        isUrgent: false,
        labels: [],
    },
    {
        type: 'freeText',
        id: '9',
        status: 'new',
        isRead: true,
        patientName: 'Rodrick Harris',
        requestDate: '2025-05-21T00:00:00.000Z',
        lastModifiedDate: '2025-05-21T14:12:55.226Z',
        description: '[05/21/25] Request for New Prescription',
        estimatedTimeSec: 262,
        assignment: {
            assignDate: '2025-05-21T14:12:55.226Z',
            assignedTo: 'Dr. Johnson',
        },
        isUrgent: false,
        labels: ['Sx', 'Rx', 'Clinical'],
    },
    {
        type: 'freeText',
        id: '10',
        status: 'new',
        isRead: true,
        patientName: 'Aria Hudson',
        requestDate: '2025-05-21T00:00:00.000Z',
        lastModifiedDate: '2025-05-21T13:56:23.324Z',
        description: '[05/21/25] Follow-up on Recent Appointment',
        estimatedTimeSec: 208,
        assignment: {
            assignDate: '2025-05-21T13:56:23.324Z',
            assignedTo: 'Dr. Johnson',
        },
        isUrgent: false,
        labels: ['Scheduling', 'Clinical'],
    },
];
