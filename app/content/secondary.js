import { 
    Microscope, 
    Palette, 
    Calculator, 
} from 'lucide-react';
export  const departments = {
        science: {
            title: "Science Department",
            icon: <Microscope className="w-8 h-8" />,
            color: "brand",
            description: "Preparing future scientists, doctors, engineers, and technologists through rigorous scientific education and practical experimentation.",
            coreSubjects: [
                "Mathematics",
                "Physics", 
                "Chemistry",
                "Biology",
                "Further Mathematics",
                "Agricultural Science",
                "Computer Science"
            ],
            compulsorySubjects: [
                "English Language",
                "Mathematics", 
                "Civic Education",
                "Physics",
                "Chemistry",
                "Biology"
            ],
            careerPaths: [
                "Medicine & Surgery",
                "Engineering (All branches)",
                "Pharmacy",
                "Nursing",
                "Laboratory Science",
                "Computer Science",
                "Architecture",
                "Veterinary Medicine",
                "Dentistry",
                "Biochemistry"
            ],
            facilities: [
                "Modern Physics Laboratory",
                "Well-equipped Chemistry Lab",
                "Biology Laboratory with specimens",
                "Computer Laboratory",
                "Mathematics Resource Center",
                "Agricultural Science Farm"
            ],
            achievements: [
                "95% WAEC pass rate in Science subjects",
                "Multiple winners in National Science Competitions",
                "High university admission success rate",
                "Award-winning Science Club projects"
            ]
        },
        arts: {
            title: "Arts Department", 
            icon: <Palette className="w-8 h-8" />,
            color: "brand",
            description: "Nurturing creativity, critical thinking, and cultural awareness through humanities and social sciences education.",
            coreSubjects: [
                "Literature in English",
                "Government",
                "History", 
                "Geography",
                "Economics",
                "Christian Religious Studies",
                "Islamic Religious Studies",
                "French",
                "Hausa",
                "Igbo",
                "Yoruba"
            ],
            compulsorySubjects: [
                "English Language",
                "Mathematics",
                "Civic Education", 
                "Literature in English",
                "Government",
                "History"
            ],
            careerPaths: [
                "Law",
                "Mass Communication",
                "Political Science", 
                "International Relations",
                "English Language",
                "Theatre Arts",
                "Philosophy",
                "Linguistics",
                "Psychology",
                "Sociology"
            ],
            facilities: [
                "Well-stocked Library",
                "Language Laboratory",
                "Arts & Crafts Studio",
                "Drama Theatre",
                "Geography Resource Room",
                "History Museum Corner"
            ],
            achievements: [
                "Outstanding WAEC performance in Arts subjects",
                "Winners of Inter-school Debate competitions",
                "Published student literary works",
                "Cultural performance awards"
            ]
        },
        commercial: {
            title: "Commercial Department",
            icon: <Calculator className="w-8 h-8" />,
            color: "brand", 
            description: "Building future business leaders and entrepreneurs through comprehensive business education and practical skills development.",
            coreSubjects: [
                "Financial Accounting",
                "Commerce",
                "Economics",
                "Business Studies",
                "Marketing",
                "Office Practice",
                "Store Management",
                "Data Processing",
                "Statistics"
            ],
            compulsorySubjects: [
                "English Language",
                "Mathematics",
                "Civic Education",
                "Financial Accounting",
                "Commerce", 
                "Economics"
            ],
            careerPaths: [
                "Accounting",
                "Business Administration",
                "Banking & Finance",
                "Marketing",
                "Economics", 
                "Insurance",
                "Public Administration",
                "Entrepreneurship",
                "Human Resource Management",
                "Project Management"
            ],
            facilities: [
                "Modern Business Laboratory",
                "Accounting Software Training Center",
                "Entrepreneurship Development Center",
                "Mock Office Setup",
                "Business Resource Library",
                "ICT Training Center"
            ],
            achievements: [
                "Excellent WAEC results in Commercial subjects",
                "Student-run business ventures",
                "Entrepreneurship competition winners",
                "Professional certification partnerships"
            ]
        }
    };

export  const generalSubjects = [
        "English Language (Compulsory)",
        "Mathematics (Compulsory)", 
        "Civic Education (Compulsory)",
        "Physical & Health Education",
        "Trade Subjects (Carpentry, Electrical, etc.)",
        "Computer Studies",
        "Fine Arts",
        "Music"
    ];