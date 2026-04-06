import * as Yup from 'yup';
// Validation schemas for each stage
export const stage1Schema = Yup.object().shape({
    surname: Yup.string().required('Surname is required'),
    firstName: Yup.string().required('First name is required'),
    middleName: Yup.string(),
    dateOfBirth: Yup.string().required('Date of birth is required'),
    gender: Yup.string().required('Gender is required'),
    bloodGroup: Yup.string(),
    genotype: Yup.string(),
    nationality: Yup.string().required('Nationality is required'),
    stateOfOrigin: Yup.string().required('State of origin is required'),
    localGovernment: Yup.string().required('Local government is required'),
    schoolingOption: Yup.string().required('Schooling option is required')
});

export const stage2Schema = Yup.object().shape({
    father: Yup.object().shape({
        name: Yup.string().required("Father's name is required"),
        occupation: Yup.string(),
        officeAddress: Yup.string(),
        homeAddress: Yup.string().required("Father's home address is required"),
        homePhone: Yup.string().required("Father's home phone is required"),
        whatsApp: Yup.string(),
        // email: Yup.string().email('Invalid email').required("Father's email is required")
    }),
    mother: Yup.object().shape({
        name: Yup.string().required("Mother's name is required"),
        occupation: Yup.string(),
        officeAddress: Yup.string(),
        homeAddress: Yup.string().required("Mother's home address is required"),
        homePhone: Yup.string().required("Mother's home phone is required"),
        whatsApp: Yup.string(),
        // email: Yup.string().email('Invalid email').required("Mother's email is required")
    })
});

export const stage3Schema = Yup.object().shape({
    schools: Yup.object().shape({
        school1: Yup.string(),
        school1StartDate: Yup.string(),
        school1EndDate: Yup.string(),
        school2: Yup.string(),
        school2StartDate: Yup.string(),
        school2EndDate: Yup.string(),
        school3: Yup.string(),
        school3StartDate: Yup.string(),
        school3EndDate: Yup.string()
    }),
    classPreferences: Yup.object().shape({
        presentClass: Yup.string(),
        classInterestedIn: Yup.string().required('Class interested in is required')
    }),
    health: Yup.object().shape({
        infectiousDisease: Yup.string(),
        foodAllergy: Yup.string()
    })
});

export const stage4Schema = Yup.object().shape({
    documents: Yup.object().shape({
        birthCertificate: Yup.mixed(),
        formerSchoolReport: Yup.mixed(),
        medicalReport: Yup.mixed(),
       
    }),
    contact: Yup.object().shape({
        correspondenceEmail: Yup.string().email('Invalid email'),
        howDidYouKnow: Yup.string()
    })
});