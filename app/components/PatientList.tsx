import React from 'react';

// Define the type for a single patient
interface Patient {
  id: string;
  name: string;
  // Add other fields as necessary
}

interface PatientListProps {
  patients: Patient[];
}

function PatientList({ patients }: PatientListProps) {
  return (
    <div>
      <h1>Patient List</h1>
      <ul>
        {patients.map(patient => (
          <li key={patient.id}>
            <span>{patient.name}</span>
            {/* Remove the Retrieve button */}
            {/* <button onClick={() => retrieveDocument(patient.id)}>Retrieve</button> */}
            {/* Add the View button */}
            <button onClick={() => viewDocument(patient.id)}>View Document</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Function to handle viewing the document
function viewDocument(patientId: string) {
  // Logic to view the document
  console.log(`Viewing document for patient ID: ${patientId}`);
}

export default PatientList;