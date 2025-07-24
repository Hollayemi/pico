import { 
    Scissors, 
    Palette, 
    ChefHat, 
    ShirtIcon as Shoe,
    Camera, 
    Music, 
    Brush,
    Award,
    Users,
    Clock,
    Target,
    Star,
    ArrowRight,
    CheckCircle
} from 'lucide-react';

export const vocationalPrograms = [
        {
            id: 'tailoring',
            title: 'Tailoring & Fashion Design',
            icon: <Scissors className="w-8 h-8" />,
            color: 'brand-primary',
            image: '/images/tailoring.jpg',
            description: 'Master the art of garment creation, pattern making, and fashion design with professional-grade equipment and expert instruction.',
            duration: '6 months - 2 years',
            skillsLearned: [
                'Pattern making and cutting',
                'Hand and machine sewing techniques',
                'Fashion design principles',
                'Garment construction',
                'Alterations and repairs',
                'Business skills for fashion entrepreneurship'
            ],
            certifications: ['NABTEB Certificate', 'Industry Partnership Certificate'],
            careerPaths: ['Fashion Designer', 'Tailor', 'Pattern Maker', 'Fashion Entrepreneur', 'Costume Designer'],
            equipmentProvided: ['Industrial sewing machines', 'Overlock machines', 'Cutting tables', 'Measuring tools', 'Design software access']
        },
        {
            id: 'tiedye',
            title: 'Tie & Dye Art',
            icon: <Palette className="w-8 h-8" />,
            color: 'brand-secondary',
            image: '/images/adire.jpeg',
            description: 'Learn traditional and modern tie-dye techniques, color theory, and fabric manipulation to create beautiful artistic textiles.',
            duration: '3-6 months',
            skillsLearned: [
                'Traditional tie-dye methods',
                'Color mixing and theory',
                'Fabric preparation techniques',
                'Pattern creation and design',
                'Chemical safety and handling',
                'Product finishing and packaging'
            ],
            certifications: ['Craft Certification', 'Textile Arts Certificate'],
            careerPaths: ['Textile Artist', 'Craft Entrepreneur', 'Fashion Accessories Designer', 'Art Instructor'],
            equipmentProvided: ['Dye vats', 'Chemical supplies', 'Various fabrics', 'Protective equipment', 'Design templates']
        },
        {
            id: 'snacks',
            title: 'Snacks & Food Production',
            icon: <ChefHat className="w-8 h-8" />,
            color: 'brand-accent',
            image: '/images/snack.jpg',
            description: 'Develop culinary skills in snack production, food safety, packaging, and small-scale food business management.',
            duration: '4-8 months',
            skillsLearned: [
                'Food preparation and cooking techniques',
                'Food safety and hygiene standards',
                'Recipe development and scaling',
                'Packaging and preservation methods',
                'Cost calculation and pricing',
                'Food business management'
            ],
            certifications: ['Food Handler\'s Certificate', 'NAFDAC Registration Guidance'],
            careerPaths: ['Food Entrepreneur', 'Catering Services', 'Restaurant Owner', 'Food Vendor', 'Nutritionist Assistant'],
            equipmentProvided: ['Commercial kitchen equipment', 'Packaging machines', 'Storage facilities', 'Quality testing tools']
        },
        {
            id: 'shoemaking',
            title: 'Shoe Making & Repair',
            icon: <Shoe className="w-8 h-8" />,
            color: 'brand-warning',
            image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Learn the traditional craft of shoe making, from leather working to modern footwear construction and repair techniques.',
            duration: '6 months - 1 year',
            skillsLearned: [
                'Leather working and treatment',
                'Shoe pattern making',
                'Sole attachment techniques',
                'Shoe repair and restoration',
                'Footwear design principles',
                'Tool usage and maintenance'
            ],
            certifications: ['Leather Work Certificate', 'Footwear Technology Certificate'],
            careerPaths: ['Shoe Maker', 'Leather Craftsperson', 'Shoe Repair Specialist', 'Footwear Designer', 'Leather Goods Entrepreneur'],
            equipmentProvided: ['Leather working tools', 'Sewing machines', 'Lasts and forms', 'Adhesives and materials', 'Finishing equipment']
        },
        {
            id: 'photography',
            title: 'Photography & Digital Media',
            icon: <Camera className="w-8 h-8" />,
            color: 'brand-success',
            image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Master digital photography, photo editing, and multimedia production with modern equipment and software training.',
            duration: '4-6 months',
            skillsLearned: [
                'Camera operation and settings',
                'Composition and lighting techniques',
                'Photo editing software (Photoshop, Lightroom)',
                'Portrait and event photography',
                'Video production basics',
                'Photography business skills'
            ],
            certifications: ['Digital Photography Certificate', 'Adobe Software Certification'],
            careerPaths: ['Professional Photographer', 'Photo Editor', 'Event Photographer', 'Social Media Content Creator', 'Multimedia Specialist'],
            equipmentProvided: ['DSLR cameras', 'Lighting equipment', 'Editing software', 'Studio setup', 'Printing facilities']
        },
        {
            id: 'music',
            title: 'Musical Training',
            icon: <Music className="w-8 h-8" />,
            color: 'brand-info',
            image: '/images/musical.jpg',
            description: 'Develop musical talents through instrument training, music theory, composition, and performance opportunities.',
            duration: '6 months - Ongoing',
            skillsLearned: [
                'Instrument proficiency (Piano, Guitar, Drums)',
                'Music theory and notation',
                'Song composition and arrangement',
                'Performance techniques',
                'Music production basics',
                'Band coordination and leadership'
            ],
            certifications: ['Music Performance Certificate', 'Music Theory Certificate'],
            careerPaths: ['Professional Musician', 'Music Teacher', 'Music Producer', 'Composer', 'Sound Engineer', 'Music Therapist'],
            equipmentProvided: ['Various musical instruments', 'Recording equipment', 'Music software', 'Practice rooms', 'Performance stage']
        },
        {
            id: 'art',
            title: 'Visual Arts & Crafts',
            icon: <Brush className="w-8 h-8" />,
            color: 'brand-danger',
            image: '/images/piso2.jpg',
            description: 'Explore various art mediums including painting, drawing, sculpture, and mixed media to develop creative expression.',
            duration: '3-12 months',
            skillsLearned: [
                'Drawing and sketching techniques',
                'Painting (watercolor, acrylic, oil)',
                'Sculpture and 3D art',
                'Mixed media and collage',
                'Art history and appreciation',
                'Portfolio development'
            ],
            certifications: ['Visual Arts Certificate', 'Creative Arts Diploma'],
            careerPaths: ['Visual Artist', 'Art Teacher', 'Graphic Designer', 'Art Therapist', 'Gallery Curator', 'Freelance Artist'],
            equipmentProvided: ['Art supplies and materials', 'Easels and workstations', 'Kiln for ceramics', 'Display areas', 'Art library']
        }
    ];

    export const programBenefits = [
        {
            icon: <Target className="w-6 h-6" />,
            title: 'Practical Skills',
            description: 'Hands-on training that prepares students for real-world applications'
        },
        {
            icon: <Award className="w-6 h-6" />,
            title: 'Certified Training',
            description: 'Industry-recognized certificates upon successful completion'
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: 'Expert Instructors',
            description: 'Learn from experienced professionals and master craftspeople'
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: 'Flexible Schedule',
            description: 'Programs designed to fit alongside regular academic studies'
        }
    ];