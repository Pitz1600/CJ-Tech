import settingsModel from '../models/settingsModel.js';

export const getSettings = async (req, res) => {
    try {
        let settings = await settingsModel.findOne();
        if (!settings) {
            settings = await settingsModel.create({
                services: [
                    { icon: "🎛️", title: "Board Repair Services", description: "Precision diagnosis and microsoldering for complex motherboard failures. Reliable restoration for all devices.", price: "STARTING FROM ₱1,500" },
                    { icon: "⚙️", title: "Component Level Repair", description: "Advanced sourcing and precision replacement of individual SMD components, ICs, and delicate circuitry.", price: "" },
                    { icon: "💾", title: "IC Programming & BIOS", description: "Expert BIOS flashing, firmware restoration, and NAND programming for bricked or unresponsive systems.", price: "" },
                    { icon: "💿", title: "Professional Data Recovery", description: "High-success retrieval of critical assets from physically damaged storage, SSDs, and mobile NAND chips.", price: "" }
                ],
                carouselImages: ["/assets/cj-tech-bg.jpg"]
            });
        }
        res.json({ success: true, settings });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const { landingTitle, landingSubtitle, services, carouselImages, showServices, showCarousel } = req.body;
        let settings = await settingsModel.findOne();
        if (settings) {
            settings.landingTitle = landingTitle !== undefined ? landingTitle : settings.landingTitle;
            settings.landingSubtitle = landingSubtitle !== undefined ? landingSubtitle : settings.landingSubtitle;
            settings.services = services !== undefined ? services : settings.services;
            settings.carouselImages = carouselImages !== undefined ? carouselImages : settings.carouselImages;
            settings.showServices = showServices !== undefined ? showServices : settings.showServices;
            settings.showCarousel = showCarousel !== undefined ? showCarousel : settings.showCarousel;
            await settings.save();
        } else {
            settings = await settingsModel.create(req.body);
        }
        res.json({ success: true, settings });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
