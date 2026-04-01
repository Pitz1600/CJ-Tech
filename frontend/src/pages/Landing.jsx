import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import cjtechlogo from '../assets/cj-tech-logo.png';
import cjtechwhite from '../assets/cj-tech-white.jpg';
import '../styles/Landing.css';

const Landing = () => {
    const { settings } = useContext(AppContext);
    const [currentSlide, setCurrentSlide] = useState(0);

    const title = settings?.landingTitle || 'CJ Tech Shop';
    const subtitle = settings?.landingSubtitle || 'PERSONAL WEBSITE';

    // Fallback/migrate data formats properly based on recent changes
    const services = settings?.services || [];
    const images = (settings?.carouselImages || []).map(img => {
        if (typeof img === 'string') return { image: img, title: '', subtitle: '' };
        return img;
    }).filter(img => img && img.image);

    useEffect(() => {
        if (images.length < 2) return;

        // 5 minutes autoplay interval
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 300000);
        return () => clearInterval(interval);
    }, [images]);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    return (
        <div className="landing-container pb-20">
            <div className="landing-info">
                <div className="landing-logo">
                    <img src={cjtechwhite} alt="CJ-Tech Logo" className="logo-img" />
                </div>

                <h1 className="hero-title">
                    {title}
                </h1>
                <p className="hero-subtitle text-secondary mb-8">{subtitle}</p>

                <div className="mb-12">
                    <Link to="/dashboard" className="btn btn-primary px-8 py-3 text-lg font-bold">
                        Go to Dashboard
                    </Link>
                </div>

                {services.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full mb-12">
                        {services.map((svc, idx) => (
                            <div className="bg-[#171A21] border border-[var(--border-color)] rounded-xl p-6 flex items-start justify-between cursor-default hover:border-[var(--accent-blue)] hover:-translate-y-1 transition-all shadow-lg" key={idx}>
                                <div className="flex-1 pr-4">
                                    <h3 className="text-white font-bold text-lg mb-2">{svc.title}</h3>
                                    <p className="text-secondary text-sm mb-4 leading-relaxed">{svc.description}</p>
                                    {svc.price && <span className="bg-[#0F1115] border border-[var(--border-color)] px-3 py-1 rounded text-success text-xs font-bold">{svc.price}</span>}
                                </div>
                                <div className="text-4xl bg-[#0F1115] p-3 rounded-lg border border-[var(--border-color)] flex items-center justify-center min-w-[60px] min-h-[60px] shadow-inner">{svc.icon}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {images.length > 0 && (
                <div className="max-w-4xl mx-auto w-full mt-10 px-4">
                    <div className="carousel-wrapper bg-[#171A21] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-2xl flex flex-col">

                        <div className="relative w-full aspect-video bg-cover bg-center transition-all duration-500" style={{ backgroundImage: `url(${images[currentSlide].image})` }}>
                            {images.length > 1 && (
                                <>
                                    <button
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-[var(--accent-blue)] text-white rounded-full flex items-center justify-center transition-colors shadow-lg z-10 border border-white/10"
                                        onClick={prevSlide}
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-[var(--accent-blue)] text-white rounded-full flex items-center justify-center transition-colors shadow-lg z-10 border border-white/10"
                                        onClick={nextSlide}
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="p-6 md:p-8 bg-[#171A21] text-center flex-1 flex flex-col justify-center">
                            {(images[currentSlide].title || images[currentSlide].subtitle) ? (
                                <>
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">{images[currentSlide].title}</h2>
                                    <p className="text-secondary text-lg mb-6">{images[currentSlide].subtitle}</p>
                                </>
                            ) : (
                                <div className="h-6"></div>
                            )}

                            {images.length > 1 && (
                                <div className="flex justify-center items-center mt-auto pt-4">
                                    {images.map((img, idx) => (
                                        <span
                                            key={idx}
                                            className={`w-3 h-3 rounded-full mx-2 cursor-pointer transition-all ${currentSlide === idx ? 'bg-[var(--accent-blue)] scale-125 shadow-[0_0_8px_var(--accent-blue)]' : 'bg-gray-600 hover:bg-gray-400'}`}
                                            onClick={() => setCurrentSlide(idx)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Landing;
