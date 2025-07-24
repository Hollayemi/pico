
"use client"
import Button from '@/app/components/Form/Button'
import Modal from '@/app/components/Modal'
import HomeWrapper from '@/app/components/wrapper'
import Image from 'next/image'
import React, { useState } from 'react'
import SendInformation from './components/popUps'
import { steps } from './components/steps'
import { useRouter } from 'next/navigation'

const Addmissions = () => {
    const router = useRouter()
    const [openStep, setOpenStep] = useState('step1');

    const toggleStep = (step) => {
        setOpenStep(openStep === step ? '' : step);
    };

    const [openModal, setModalOpen] = useState()
    return (
        <HomeWrapper miniSlider title="Admissions Form">
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white">
                    <div className="max-w-6xl mx-auto px-4 py-6">
                        <h1 className="text-4xl font-bold text-center text-brand-900 mb-8">
                            Welcome to Progress
                        </h1>
                        {/* Navigation Buttons */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button onClick={() => setModalOpen("send_information")} title="Send me information" variant='secondary' />
                            <Button onClick={() => router.push("/admissions/apply")} title="Apply Now" variant='secondary' />
                            <Button onClick={() => { }} title="Staff Login" variant='secondary' />
                        </div>
                    </div>
                </header>
                <section className="max-w-6xl mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        {/* Image Section */}
                        <div className="bg-black">
                            <Image src="/images/students.jpg" alt="students" width={600} height={600} className='w-full aspect-auto' />
                        </div>

                        {/* Content Section */}
                        <div className="order-1 lg:order-2 space-y-6">
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Thank you for your interest in Progress School.
                                </p>

                                <p className="text-gray-700 leading-relaxed mb-4">
                                    🎉 Admissions are still open! Apply now to secure your child's spot before the October 12th deadline. Don't miss this opportunity to join our community of excellence.
                                </p>

                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Applications for new student entry in September 2026 will be available in the fall.
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    If you have any questions, please feel free to contact us at{' '}
                                    <a
                                        href="mailto:findyourself@tanenbaumchat.org"
                                        className="text-orange-500 hover:text-orange-600 font-medium underline"
                                    >
                                        admissions@progessschools.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>



                <section className="min-h-screen bg-gray-50">
                    {/* Header Section */}
                    <div className="bg-white py-12">
                        <div className="max-w-4xl mx-auto px-4 text-center">
                            <h1 className="text-4xl font-bold text-brand-900 mb-6">
                                How to apply
                            </h1>
                            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
                                Throughout the admissions process, we will get to know each other and we will assess how we can best support
                                your child to ensure their success at TanenbaumCHAT. For more information on applying see below:
                            </p>
                        </div>
                    </div>

                    {/* Steps Section */}
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {steps.map((step) => (
                                <div key={step.id} className={`rounded-lg ${openStep === step.id && "shadow-sm"} overflow-hidden`}>
                                    <button
                                        onClick={() => toggleStep(step.id)}
                                        className="w-full bg-brand-800 text-white px-6 py-4 text-left font-medium flex items-center justify-between hover:bg-brand-900 transition-colors"
                                    >
                                        <span className="flex items-center">
                                            <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                                            {step.title}
                                        </span>
                                        <span className="text-xl">
                                            {openStep === step.id ? '−' : '+'}
                                        </span>
                                    </button>
                                    {openStep === step.id && (
                                        <div className="px-6 py-6 transition bg-gray-50">
                                            {step.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <Modal isOpen={!!openModal} size='large' title="Admission Portal" className="!px-0" onClose={() => setModalOpen(null)}>
                    <SendInformation />
                </Modal>
            </div>
        </HomeWrapper>
    )
}

export default Addmissions