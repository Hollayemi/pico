import React from 'react'
import Header from './header'
import Footer from './footer'
import SlideDisplay from '../slider/slider'

export const HomeWrapper = ({ children, isHome, miniSlider }) => {
    return (
        <div>
            <Header isHome={isHome} />
            {miniSlider && <SlideDisplay noContent />}
            {children}
            <Footer />
        </div>
    )
}

export default HomeWrapper;
