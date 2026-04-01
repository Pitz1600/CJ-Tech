import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    landingTitle: { type: String, default: "CJ Tech Shop" },
    landingSubtitle: { type: String, default: "Advanced Solutions for Your Tech Needs." },
    services: [
        {
            icon: { type: String, default: "🎛️" },
            title: { type: String, default: "Service Title" },
            description: { type: String, default: "Service Description" },
            price: { type: String, default: "" }
        }
    ],
    carouselImages: [
        {
            image: { type: String, required: true }, // base64 string
            title: { type: String, default: "" },
            subtitle: { type: String, default: "" }
        }
    ]
}, { timestamps: true });

const settingsModel = mongoose.models.settings || mongoose.model('settings', settingsSchema);
export default settingsModel;
