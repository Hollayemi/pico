export const feeStructure = {
    primaryBoarders: {
        tuition: 185000,
        tuitionSecond: 260500,
        tuitionThird: 260500,
        uniform: 15000,
        shoes: 10000,
        examination: 1000,
        computer: 500,
        development: 3000,
        chair: 2000,
        science: 500,
        coaching: 3000,
        cardigan: 7000,
        studentFile: 500,
        reportSheet: 1000,
        healthLaundry: 6000,
        exerciseBooks: 6000,
        sportWears: 14000,
        hostelWears: 24000,
        socialWears: 25000,
        endOfSession: 8000,
        textBooks: 30000,
        totalFirstTerm: 304000,
        totalSecondTerm: 278000,
        totalThirdTerm: 286000
    },
    juniorDay: {
        tuition: 213000,
        tuitionSecond: 142000,
        tuitionThird: 142000,
        uniform: 20000,
        shoes: 11000,
        examination: 2000,
        computer: 3000,
        skillAcquisition: 3000,
        development: 6000,
        chair: 2000,
        science: 1000,
        coaching: 4000,
        identityCard: 2000,
        cardigan: 7000,
        studentFile: 1000,
        reportSheet: 1000,
        health: 1000,
        exerciseBooks: 10000,
        sportWears: 14000,
        anniversary: 4000,
        endOfSession: 8000,
        textBooks: 50000,
        totalFirstTerm: 108000,
        totalSecondTerm: 171000,
        totalThirdTerm: 179000
    },
    juniorBoarders: {
        tuition: 215000,
        tuitionSecond: 273000,
        tuitionThird: 273000,
        uniform: 20000,
        shoes: 11000,
        examination: 2000,
        computer: 3000,
        skillAcquisition: 3000,
        development: 3000,
        chair: 2000,
        science: 1000,
        coaching: 3000,
        identityCard: 2000,
        cardigan: 7000,
        studentFile: 1000,
        reportSheet: 1000,
        healthLaundry: 6000,
        exerciseBooks: 11000,
        sportWears: 14000,
        hostelWears: 16000,
        churchWears: 25000,
        anniversary: 4000,
        endOfSession: 8000,
        textBooks: 50000,
        totalFirstTerm: 347000,
        totalSecondTerm: 302000,
        totalThirdTerm: 310000
    },
    seniorDay: {
        tuition: 135000,
        tuitionSecond: 148000,
        tuitionThird: 148000,
        uniform: 22000,
        shoes: 11000,
        examination: 2000,
        computer: 3000,
        skillAcquisition: 3000,
        development: 6000,
        chair: 2000,
        science: 2000,
        coaching: 3000,
        identityCard: 2000,
        cardigan: 7000,
        studentFile: 1000,
        reportSheet: 1000,
        health: 1000,
        exerciseBooks: 11000,
        sportWears: 14000,
        anniversary: 4000,
        endOfSession: 8000,
        textBooks: 50000,
        totalFirstTerm: 116000,
        totalSecondTerm: 176000,
        totalThirdTerm: 183000
    },
    seniorBoarders: {
        tuition: 219000,
        tuitionSecond: 277000,
        tuitionThird: 277000,
        uniform: 20000,
        shoes: 11000,
        examination: 2000,
        computer: 3000,
        skillAcquisition: 3000,
        development: 3000,
        chair: 2000,
        science: 2000,
        coaching: 3000,
        identityCard: 2000,
        cardigan: 7000,
        studentFile: 1000,
        reportSheet: 1000,
        healthLaundry: 6000,
        exerciseBooks: 11000,
        sportWears: 14000,
        hostelWears: 20000,
        churchWears: 25000,
        anniversary: 4000,
        endOfSession: 8000,
        textBooks: 50000,
        totalFirstTerm: 356000,
        totalSecondTerm: 307000,
        totalThirdTerm: 315000
    }
};

export const classOptions = [
    { value: 'primaryBoarders', label: 'Primary School (Boarders)' },
    { value: 'juniorDay', label: 'Junior Secondary (Day School)' },
    { value: 'juniorBoarders', label: 'Junior Secondary (Boarders)' },
    { value: 'seniorDay', label: 'Senior Secondary (Day School)' },
    { value: 'seniorBoarders', label: 'Senior Secondary (Boarders)' }
];

export const paymentPlans = [
    { id: 'first', name: '1st Term Payment' },
    { id: 'second', name: '2nd Term Payment' },
    { id: 'third', name: '3rd Term Payment' },
    { id: 'full', name: 'Full Year Payment (5% Discount)' }
];

export const bankingDetails = [
    { bank: 'UBA', branch: 'ONDO', accountNumber: '1001025429', owner: 'PROGRESS COLLEGE' },
    { bank: 'POLARIS', branch: 'ONDO', accountNumber: '4090929802', owner: 'PROGRESS COLLEGE' },
    { bank: 'GTBANK', branch: 'ONDO', accountNumber: '0374980701', owner: 'PROGRESS COLLEGE' }
];



// export const feeStructure = {
//     nursery1: {
//         tuition: 180000,
//         registration: 15000,
//         development: 25000,
//         uniform: 12000,
//         books: 8000,
//         total: 240000
//     },
//     nursery2: {
//         tuition: 200000,
//         registration: 15000,
//         development: 25000,
//         uniform: 12000,
//         books: 10000,
//         total: 262000
//     },
//     kg1: {
//         tuition: 220000,
//         registration: 15000,
//         development: 25000,
//         uniform: 15000,
//         books: 12000,
//         total: 287000
//     },
//     kg2: {
//         tuition: 240000,
//         registration: 15000,
//         development: 25000,
//         uniform: 15000,
//         books: 15000,
//         total: 310000
//     },
//     primary1: {
//         tuition: 280000,
//         registration: 20000,
//         development: 30000,
//         uniform: 18000,
//         books: 20000,
//         total: 368000
//     },
//     primary2: {
//         tuition: 300000,
//         registration: 20000,
//         development: 30000,
//         uniform: 18000,
//         books: 22000,
//         total: 390000
//     },
//     primary3: {
//         tuition: 320000,
//         registration: 20000,
//         development: 30000,
//         uniform: 18000,
//         books: 25000,
//         total: 413000
//     },
//     primary4: {
//         tuition: 350000,
//         registration: 20000,
//         development: 30000,
//         uniform: 20000,
//         books: 28000,
//         total: 448000
//     },
//     primary5: {
//         tuition: 380000,
//         registration: 25000,
//         development: 35000,
//         uniform: 20000,
//         books: 30000,
//         total: 490000
//     },
//     primary6: {
//         tuition: 420000,
//         registration: 25000,
//         development: 35000,
//         uniform: 20000,
//         books: 35000,
//         total: 535000
//     }
// };

// export const classOptions = [
//     { value: 'nursery1', label: 'Nursery 1' },
//     { value: 'nursery2', label: 'Nursery 2' },
//     { value: 'kg1', label: 'KG 1' },
//     { value: 'kg2', label: 'KG 2' },
//     { value: 'primary1', label: 'Primary 1' },
//     { value: 'primary2', label: 'Primary 2' },
//     { value: 'primary3', label: 'Primary 3' },
//     { value: 'primary4', label: 'Primary 4' },
//     { value: 'primary5', label: 'Primary 5' },
//     { value: 'JSS1', label: 'JSS 1' },
//     { value: 'JSS2', label: 'JSS 2' },
//     { value: 'JSS3', label: 'JSS 3' },
//     { value: 'SS1', label: 'SS 1' },
//     { value: 'SS2', label: 'SS 2' },
//     { value: 'SS3', label: 'SS 3' }
// ];

// export const paymentPlans = [
//     {
//         id: 'full',
//         name: 'Full Payment',
//         discount: 5,
//         description: 'Pay full year fees at once and get 5% discount'
//     },
//     {
//         id: 'termly',
//         name: 'Termly Payment',
//         discount: 0,
//         description: 'Pay fees per term (3 installments)'
//     },
//     {
//         id: 'monthly',
//         name: 'Monthly Payment',
//         discount: 0,
//         description: 'Pay fees monthly (10 installments)'
//     }
// ];