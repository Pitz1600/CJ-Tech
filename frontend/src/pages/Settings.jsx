import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import '../styles/Settings.css';

const Settings = () => {
    const { settings, updateSettings } = useContext(AppContext);

    const [landingTitle, setLandingTitle] = useState('');
    const [landingSubtitle, setLandingSubtitle] = useState('');
    const [services, setServices] = useState([]);
    const [carouselImages, setCarouselImages] = useState([]);

    // Modal States
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [serviceForm, setServiceForm] = useState({ id: null, icon: '🎛️', title: '', description: '', price: '' });

    const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
    const [slideForm, setSlideForm] = useState({ id: null, image: '', title: '', subtitle: '' });

    useEffect(() => {
        if (settings) {
            setLandingTitle(settings.landingTitle || '');
            setLandingSubtitle(settings.landingSubtitle || '');
            setServices(settings.services || []);

            // Migrate old string arrays to object array format
            const migratedImages = (settings.carouselImages || []).map(img => {
                if (typeof img === 'string') return { image: img, title: '', subtitle: '' };
                return img;
            });
            setCarouselImages(migratedImages);
        }
    }, [settings]);

    const handleSavePrimary = async () => {
        const payload = {
            landingTitle,
            landingSubtitle,
            services,
            carouselImages
        };
        await updateSettings(payload);
    };

    // Services Logic
    const openServiceModal = (svc = null, index = null) => {
        if (svc) {
            setServiceForm({ id: index, ...svc });
        } else {
            setServiceForm({ id: null, icon: '🎛️', title: '', description: '', price: '' });
        }
        setIsServiceModalOpen(true);
    };

    const saveService = () => {
        if (!serviceForm.title || !serviceForm.description) return toast.error("Title and Description required");

        let newServices = [...services];
        if (serviceForm.id !== null) {
            newServices[serviceForm.id] = { icon: serviceForm.icon, title: serviceForm.title, description: serviceForm.description, price: serviceForm.price };
        } else {
            newServices.push({ icon: serviceForm.icon, title: serviceForm.title, description: serviceForm.description, price: serviceForm.price });
        }
        setServices(newServices);
        setIsServiceModalOpen(false);
    };

    const deleteService = (index) => {
        if (window.confirm('Remove this service?')) {
            setServices(services.filter((_, i) => i !== index));
        }
    };

    // Carousel Logic
    const openSlideModal = (slide = null, index = null) => {
        if (slide) {
            setSlideForm({ id: index, ...slide });
        } else {
            setSlideForm({ id: null, image: '', title: '', subtitle: '' });
        }
        setIsSlideModalOpen(true);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setSlideForm({ ...slideForm, image: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const saveSlide = () => {
        if (!slideForm.image) return toast.error("An image is required!");

        let newSlides = [...carouselImages];
        if (slideForm.id !== null) {
            newSlides[slideForm.id] = { image: slideForm.image, title: slideForm.title, subtitle: slideForm.subtitle };
        } else {
            newSlides.push({ image: slideForm.image, title: slideForm.title, subtitle: slideForm.subtitle });
        }
        setCarouselImages(newSlides);
        setIsSlideModalOpen(false);
    };

    const deleteSlide = (index) => {
        if (window.confirm('Remove this slide?')) {
            setCarouselImages(carouselImages.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="settings-container pb-8">
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="page-title">Website Content</h1>
                    <p className="page-subtitle">Manage pages, text, and media visible on the public site.</p>
                </div>
                <button className="btn btn-primary px-8" onClick={handleSavePrimary}>Publish All Changes</button>
            </div>

            <div className="settings-grid">
                <div className="settings-main flex flex-col gap-6" style={{ gridColumn: '1 / -1' }}>

                    {/* Landing Copy */}
                    <div className="card">
                        <h3 className="mb-4 flex items-center gap-2"><span className="icon-badge p-1 text-sm h-auto inline-flex">📝</span> Landing Page Header</h3>
                        <div className="form-group mb-4">
                            <label>HERO TITLE</label>
                            <input type="text" value={landingTitle} onChange={e => setLandingTitle(e.target.value)} />
                        </div>
                        <div className="form-group mb-4">
                            <label>HERO SUBTITLE</label>
                            <input type="text" value={landingSubtitle} onChange={e => setLandingSubtitle(e.target.value)} />
                        </div>
                    </div>

                    {/* Services Manager */}
                    <div className="card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="flex items-center gap-2"><span className="icon-badge p-1 text-sm h-auto inline-flex">🎛️</span> Services List</h3>
                            <button className="btn btn-secondary text-xs flex items-center gap-1" onClick={() => openServiceModal()}><Plus size={14} /> Add Service</button>
                        </div>

                        {services.length === 0 ? (
                            <p className="text-secondary text-sm">No services configured. Add one to display it on the landing page.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {services.map((svc, idx) => (
                                    <div key={idx} className="border border-[var(--border-color)] bg-[var(--bg-dark)] p-4 rounded-md relative group hover:border-[var(--accent-blue)] transition-all">
                                        <div className="text-2xl mb-2">{svc.icon}</div>
                                        <h4 className="font-bold mb-1">{svc.title}</h4>
                                        <p className="text-xs text-secondary mb-2 truncate">{svc.description}</p>
                                        <div className="text-success text-xs font-bold">{svc.price}</div>

                                        <div className="absolute top-2 right-2 flex gap-1 bg-[#0F1115] rounded border border-[var(--border-color)] opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1 hover:text-[var(--accent-blue)]" onClick={() => openServiceModal(svc, idx)}><Edit2 size={12} /></button>
                                            <button className="p-1 hover:text-[var(--danger)]" onClick={() => deleteService(idx)}><Trash2 size={12} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Carousel Manager */}
                    <div className="card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="flex items-center gap-2"><span className="icon-badge p-1 text-sm h-auto inline-flex">📸</span> Image Carousel</h3>
                            <button className="btn btn-secondary text-xs flex items-center gap-1" onClick={() => openSlideModal()}><Plus size={14} /> Add Slide</button>
                        </div>

                        {carouselImages.length === 0 ? (
                            <p className="text-secondary text-sm">No slides configured. Carousel is hidden.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {carouselImages.map((slide, idx) => (
                                    <div key={idx} className="border border-[var(--border-color)] bg-[var(--bg-dark)] rounded-md overflow-hidden relative group hover:border-[var(--accent-blue)] transition-all flex flex-col">
                                        <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }}></div>
                                        <div className="p-4 flex-1">
                                            <h4 className="font-bold mb-1">{slide.title || 'Untitled Slide'}</h4>
                                            <p className="text-xs text-secondary truncate">{slide.subtitle || 'No subtitle provided'}</p>
                                        </div>

                                        <div className="absolute top-2 right-2 flex gap-1 bg-[#0F1115] rounded border border-[var(--border-color)] opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <button className="p-1 hover:text-[var(--accent-blue)]" onClick={() => openSlideModal(slide, idx)}><Edit2 size={14} /></button>
                                            <button className="p-1 hover:text-[var(--danger)]" onClick={() => deleteSlide(idx)}><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Service Modal */}
            {isServiceModalOpen && (
                <div className="modal-overlay z-50 fixed inset-0 bg-black/80 flex justify-center items-center" onClick={() => setIsServiceModalOpen(false)}>
                    <div className="modal-content bg-[#171A21] border border-[var(--border-color)] p-6 rounded-md w-[400px] max-w-full" onClick={e => e.stopPropagation()}>
                        <h2 className="mb-4">{serviceForm.id !== null ? 'Edit Service' : 'Add Service'}</h2>
                        <div className="form-group mb-3">
                            <label>Service Title</label>
                            <input type="text" value={serviceForm.title} onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} />
                        </div>
                        <div className="form-group mb-3">
                            <label>Description</label>
                            <textarea rows="3" value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}></textarea>
                        </div>
                        <div className="form-group mb-3">
                            <label>Price / Value Display (Optional)</label>
                            <input type="text" placeholder="e.g. Starting at ₱500" value={serviceForm.price} onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })} />
                        </div>
                        <div className="form-group mb-6">
                            <label>Emoji / Icon (Optional)</label>
                            <input type="text" value={serviceForm.icon} onChange={e => setServiceForm({ ...serviceForm, icon: e.target.value })} maxLength={2} />
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                            <button className="btn btn-secondary" onClick={() => setIsServiceModalOpen(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={saveService}>Save Service</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Slide Modal */}
            {isSlideModalOpen && (
                <div className="modal-overlay z-50 fixed inset-0 bg-black/80 flex justify-center items-center" onClick={() => setIsSlideModalOpen(false)}>
                    <div className="modal-content bg-[#171A21] border border-[var(--border-color)] p-6 rounded-md w-[500px] max-w-full" onClick={e => e.stopPropagation()}>
                        <h2 className="mb-4">{slideForm.id !== null ? 'Edit Carousel Slide' : 'Add Carousel Slide'}</h2>

                        <div className="mb-4">
                            <label className="text-xs font-bold text-secondary mb-2 block uppercase">Slide Image</label>
                            {slideForm.image && (
                                <img src={slideForm.image} alt="Preview" className="w-full h-40 object-cover rounded-md border border-[var(--border-color)] mb-3" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent-blue)] file:text-white hover:file:bg-blue-600 block border border-[var(--border-color)] bg-[var(--bg-dark)] rounded p-1"
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label>Slide Title (Optional)</label>
                            <input type="text" value={slideForm.title} onChange={e => setSlideForm({ ...slideForm, title: e.target.value })} placeholder="Main heading for this image" />
                        </div>
                        <div className="form-group mb-6">
                            <label>Slide Subtitle (Optional)</label>
                            <input type="text" value={slideForm.subtitle} onChange={e => setSlideForm({ ...slideForm, subtitle: e.target.value })} placeholder="Supporting text" />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                            <button className="btn btn-secondary" onClick={() => setIsSlideModalOpen(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={saveSlide}>Save Slide</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Settings;
