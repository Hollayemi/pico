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
        }
    ];

export const importantNotes = [
        "All compulsory fields marked with [compulsory] must be completed",
        "Documents should be clear, legible scans or photos",
        "Ensure all contact information is accurate and up-to-date",
        "The correspondence email will be used for all official communication"
    ];