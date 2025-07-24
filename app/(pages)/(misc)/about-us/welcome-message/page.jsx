import HomeWrapper from '@/app/components/wrapper'
import Image from 'next/image'
import React from 'react'

const WelcomeMessage = () => {
    return (
        <HomeWrapper
            miniSlider
            title="Welcome Message From The School"
            sliderImages="aboutUs"
        >
            <div className="flex gap-8 items-start max-w-6xl mx-auto mb-10">
                <div className="md:sticky top-36">
                    <div className="bg-gradient-to-br z-20 w-80 h-80 from-brand-100 to-brand-200 rounded-2xl overflow-hidden shadow-xl">
                        <Image src="/images/principal.png"
                            alt="The Principal"
                            width={300}
                            height={400}
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                </div>

                <div>
                    <div className="bg-white px-6 py-12 max-w-5xl mx-auto rounded-2xl ">
                        <h1 className="text-3xl font-extrabold text-green-800 mb-6">Welcome to Progress Intellectual School, Okeigbo</h1>
                        <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            We warmly welcome you to Progress Intellectual School, Okeigbo — a place where young minds are nurtured, values are instilled, and potential is unlocked. Our school is committed to providing a holistic, high-quality education that prepares students not just for exams, but for life.
                        </p>
                        <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            We proudly offer both a modern secondary school and a structured boarding school system for children, starting from our foundational Kiddies Section through to JSS1 and all the way up to SS3. Each stage of learning is designed to meet the intellectual, emotional, and moral needs of every student, within a safe and nurturing environment.
                        </p>
                        <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            Our dedicated teachers and staff foster academic excellence, discipline, and character development, while encouraging creativity, confidence, and a love for learning. Whether your child is starting their educational journey in our boarding Kiddies Section or preparing for WAEC and life beyond school in SS3, we are here to guide, support, and inspire.
                        </p>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            Join us at Progress Intellectual School and become part of a community where every child matters and every dream is valid. Together, we build a brighter future — one student at a time.
                        </p>
                    </div>

                </div>
            </div>
        </HomeWrapper>
    )
}

export default WelcomeMessage