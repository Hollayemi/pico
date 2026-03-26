// ─── Finance Data & Mock Data ───────────────────────────────────────────────

export const CURRENT_TERM = { label: "1st Term", value: "term1", year: "2025/2026" };
export const TERMS = [
  { label: "1st Term 2025/2026", value: "term1_2025" },
  { label: "2nd Term 2025/2026", value: "term2_2025" },
  { label: "3rd Term 2025/2026", value: "term3_2025" },
  { label: "1st Term 2024/2025", value: "term1_2024" },
];

export const FEE_STRUCTURE = {
  JSS1_DAY: 171000, JSS1_BOARDING: 302000,
  JSS2_DAY: 171000, JSS2_BOARDING: 302000,
  JSS3_DAY: 171000, JSS3_BOARDING: 302000,
  SS1_DAY: 176000,  SS1_BOARDING: 307000,
  SS2_DAY: 176000,  SS2_BOARDING: 307000,
  SS3_DAY: 183000,  SS3_BOARDING: 315000,
  PRIMARY_BOARDING: 278000,
};

const CLASSES = ["JSS 1A","JSS 1B","JSS 2A","JSS 2B","JSS 3A","JSS 3B",
  "SS 1 Science","SS 1 Arts","SS 1 Commercial",
  "SS 2 Science","SS 2 Arts","SS 2 Commercial",
  "SS 3 Science","SS 3 Arts","SS 3 Commercial"];

const SURNAMES = ["Adeyemi","Okonkwo","Hassan","Adeleke","Babatunde","Nwachukwu","Eze","Ibrahim","Afolabi","Chukwu","Olawale","Adebisi","Fashola","Okafor","Bello","Lawal","Musa","Sule","Danjuma","Abiodun"];
const FIRSTNAMES = ["Chioma","Emeka","Fatima","Tunde","Blessing","Samuel","Grace","Usman","Taiwo","Chidi","Amina","Kunle","Sade","Ifeanyi","Zainab","Damilola","Oluwafemi","Ngozi","Ibrahim","Temitope"];

const getClassFee = (cls, schooling) => {
  const isBoarding = schooling === "Boarding";
  if (cls.includes("JSS 1")) return isBoarding ? 302000 : 171000;
  if (cls.includes("JSS 2")) return isBoarding ? 302000 : 171000;
  if (cls.includes("JSS 3")) return isBoarding ? 302000 : 171000;
  if (cls.includes("SS 1")) return isBoarding ? 307000 : 176000;
  if (cls.includes("SS 2")) return isBoarding ? 307000 : 176000;
  if (cls.includes("SS 3")) return isBoarding ? 315000 : 183000;
  return 171000;
};

const generatePayments = (studentId, totalFee, rand) => {
  const payments = [];
  const payPercent = rand < 0.2 ? 0 : rand < 0.4 ? 0.5 : rand < 0.6 ? 0.75 : rand < 0.8 ? 1.0 : rand < 0.9 ? 0.25 : 1.0;
  const totalPaid = Math.round(totalFee * payPercent / 1000) * 1000;

  if (totalPaid === 0) return { payments: [], totalPaid: 0 };

  const installments = totalPaid === totalFee ? (rand > 0.6 ? 1 : 2) : 1;
  let remaining = totalPaid;

  for (let i = 0; i < installments; i++) {
    const amount = i === installments - 1 ? remaining : Math.round(remaining * 0.6 / 1000) * 1000;
    remaining -= amount;
    const day = Math.floor(rand * 28) + 1;
    payments.push({
      id: `PAY-${studentId}-${i+1}`,
      amount,
      method: ["Bank Transfer","POS","Cash","Online"][Math.floor(rand * 4)],
      date: `2025-09-${String(day).padStart(2,"0")}`,
      reference: `REF${studentId}${i+1}${Math.floor(rand*9000)+1000}`,
      receivedBy: ["Bursar Adebisi","Bursar Olawale","Bursar Hassan"][Math.floor(rand * 3)],
      term: "1st Term 2025/2026",
    });
  }
  return { payments, totalPaid };
};

export const generateStudents = () => {
  const students = [];
  let id = 1;
  CLASSES.forEach((cls, ci) => {
    const count = 20 + (ci % 5);
    for (let i = 0; i < count; i++) {
      const rand = ((ci * 100 + i * 7 + 13) % 97) / 97;
      const schooling = i % 3 === 0 ? "Boarding" : "Day";
      const totalFee = getClassFee(cls, schooling);
      const { payments, totalPaid } = generatePayments(id, totalFee, rand);
      const balance = totalFee - totalPaid;
      const paidPercent = Math.round((totalPaid / totalFee) * 100);

      students.push({
        id: `STU-2024-${String(id).padStart(4,"0")}`,
        surname: SURNAMES[(ci + i * 3) % SURNAMES.length],
        firstName: FIRSTNAMES[(ci * 2 + i) % FIRSTNAMES.length],
        class: cls,
        schooling,
        totalFee,
        totalPaid,
        balance,
        paidPercent,
        status: balance === 0 ? "Paid" : paidPercent >= 50 ? "Partial" : paidPercent > 0 ? "Low" : "Unpaid",
        payments,
        term: "1st Term 2025/2026",
        lastPaymentDate: payments.length ? payments[payments.length - 1].date : null,
      });
      id++;
    }
  });
  return students;
};

export const MOCK_STUDENTS = generateStudents();

export const getFinanceSummary = (students) => {
  const totalExpected = students.reduce((a, s) => a + s.totalFee, 0);
  const totalCollected = students.reduce((a, s) => a + s.totalPaid, 0);
  const totalOutstanding = students.reduce((a, s) => a + s.balance, 0);
  const fullyPaid = students.filter(s => s.status === "Paid").length;
  const partial = students.filter(s => s.status === "Partial" || s.status === "Low").length;
  const unpaid = students.filter(s => s.status === "Unpaid").length;
  const collectionRate = Math.round((totalCollected / totalExpected) * 100);

  return { totalExpected, totalCollected, totalOutstanding, fullyPaid, partial, unpaid, collectionRate, total: students.length };
};
