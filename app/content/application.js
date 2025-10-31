import { CheckCircle, FileText, Users, Heart, GraduationCap, Phone, House } from 'lucide-react';
export const requirementSections = [
    {
        title: "Personal Information",
        icon: <Users className="w-6 h-6" />,
        color: "brand-primary",
        items: [
            "Full name (surname, first name, middle name)",
            "Date of birth and gender",
            "Blood group and genotype",
            "Nationality, state of origin, and local government",
            "Preferred schooling option"
        ]
    },
    {
        title: "Parents' Details",
        icon: <Users className="w-6 h-6" />,
        color: "brand-secondary",
        items: [
            "Father's full details (name, occupation, addresses)",
            "Mother's full details (name, occupation, addresses)",
            "Contact information (phone, WhatsApp, email)",
            "Office and home addresses for both parents"
        ]
    },
    {
        title: "Educational Background",
        icon: <GraduationCap className="w-6 h-6" />,
        color: "brand-accent",
        items: [
            "Previous schools attended (up to 3 schools)",
            "Attendance dates for each school",
            "Present class and desired class for admission",
            "Academic records and reports"
        ]
    },
    {
        title: "Health Information",
        icon: <Heart className="w-6 h-6" />,
        color: "brand-success",
        items: [
            "Complete vaccination records",
            "History of infectious diseases (if any)",
            "Food allergies and dietary restrictions",
            "Medical reports and health certificates"
        ]
    },
    {
        title: "Required Documents",
        icon: <FileText className="w-6 h-6" />,
        color: "brand-warning",
        items: [
            "Birth certificate (compulsory)",
            "Former school report (compulsory)",
            "Proof of payment (compulsory)",
            "Immunization certificate",
            "Medical report"
        ]
    },
    {
        title: "Contact & Communication",
        icon: <Phone className="w-6 h-6" />,
        color: "brand-info",
        items: [
            "Primary correspondence email address",
            "How you learned about our school",
            "Preferred communication method",
            "Emergency contact information"
        ]
    },
    {
        title: "Borders Requirements",
        icon: <House className="w-6 h-6" />,
        color: "brand-info",
        grid: true,
        items: [
            "One small size suitcase",
            "One students mattress (2\" x 3) and a pillow",
            "Two pairs of slippers",
            "One pair of black cut shoe (flat shoes)",
            "Two pairs of black socks (for boys) and white socks (for girls)",
            "A set of cutlery (folk, spoons and knife)",
            "One small size rechargeable lamp",
            "One cover cloth and a pillow and two handkerchiefs",
            "Two bedspreads: one blue (deep) and one white with pillow case and a small blanket (available for sale in the school if you so wish)",
            "One medium - sized towel, four bathing soap, four toilet tissue, two bottles of dettol, four washing soap, four packets of detergent",
            "A stainless bucket (13lt) stainless bowl for washing, a stainless cup and a small plastic bowl for bathing",
            "2 tooth pastes, body cream, hair cream, two hangers, a dozen of hanging clips and 2 tissue paper",
            "One plastic soap bag containing sponge, comb, cup, mirror and tooth brush",
            "Three pants, singlet, black leather belt and two pajamas (for boy)",
            "Three underskirts (1 black and 2 white), four pants and two night gown (for girls)",
            "Two big brooms, one sharp cutlass and a mosquito net"
        ]
    }
];
export const importantNotes = [
    "All compulsory fields marked with [compulsory] must be completed",
    "Documents should be clear, legible scans or photos",
    "Ensure all contact information is accurate and up-to-date",
    "The correspondence email will be used for all official communication"
];