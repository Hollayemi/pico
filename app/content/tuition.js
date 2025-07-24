export const feeStructure = {
    nursery1: {
        tuition: 180000,
        registration: 15000,
        development: 25000,
        uniform: 12000,
        books: 8000,
        total: 240000
    },
    nursery2: {
        tuition: 200000,
        registration: 15000,
        development: 25000,
        uniform: 12000,
        books: 10000,
        total: 262000
    },
    kg1: {
        tuition: 220000,
        registration: 15000,
        development: 25000,
        uniform: 15000,
        books: 12000,
        total: 287000
    },
    kg2: {
        tuition: 240000,
        registration: 15000,
        development: 25000,
        uniform: 15000,
        books: 15000,
        total: 310000
    },
    primary1: {
        tuition: 280000,
        registration: 20000,
        development: 30000,
        uniform: 18000,
        books: 20000,
        total: 368000
    },
    primary2: {
        tuition: 300000,
        registration: 20000,
        development: 30000,
        uniform: 18000,
        books: 22000,
        total: 390000
    },
    primary3: {
        tuition: 320000,
        registration: 20000,
        development: 30000,
        uniform: 18000,
        books: 25000,
        total: 413000
    },
    primary4: {
        tuition: 350000,
        registration: 20000,
        development: 30000,
        uniform: 20000,
        books: 28000,
        total: 448000
    },
    primary5: {
        tuition: 380000,
        registration: 25000,
        development: 35000,
        uniform: 20000,
        books: 30000,
        total: 490000
    },
    primary6: {
        tuition: 420000,
        registration: 25000,
        development: 35000,
        uniform: 20000,
        books: 35000,
        total: 535000
    }
};

export const classOptions = [
    { value: 'nursery1', label: 'Nursery 1' },
    { value: 'nursery2', label: 'Nursery 2' },
    { value: 'kg1', label: 'KG 1' },
    { value: 'kg2', label: 'KG 2' },
    { value: 'primary1', label: 'Primary 1' },
    { value: 'primary2', label: 'Primary 2' },
    { value: 'primary3', label: 'Primary 3' },
    { value: 'primary4', label: 'Primary 4' },
    { value: 'primary5', label: 'Primary 5' },
    { value: 'JSS1', label: 'JSS 1' },
    { value: 'JSS2', label: 'JSS 2' },
    { value: 'JSS3', label: 'JSS 3' },
    { value: 'SS1', label: 'SS 1' },
    { value: 'SS2', label: 'SS 2' },
    { value: 'SS3', label: 'SS 3' }
];

export const paymentPlans = [
    {
        id: 'full',
        name: 'Full Payment',
        discount: 5,
        description: 'Pay full year fees at once and get 5% discount'
    },
    {
        id: 'termly',
        name: 'Termly Payment',
        discount: 0,
        description: 'Pay fees per term (3 installments)'
    },
    {
        id: 'monthly',
        name: 'Monthly Payment',
        discount: 0,
        description: 'Pay fees monthly (10 installments)'
    }
];