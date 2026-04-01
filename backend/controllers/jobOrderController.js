import jobOrderModel from '../models/jobOrderModel.js';

// Get all job orders for a user
export const getJobOrders = async (req, res) => {
    try {
        const jobOrders = await jobOrderModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, jobOrders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Create a new job order
export const createJobOrder = async (req, res) => {
    try {
        const { device, customerName, issueDescription, status, priority, revenue, deadline } = req.body;

        // Auto generate Job ID
        const count = await jobOrderModel.countDocuments();
        const jobId = `#JOB-${1000 + count}`;

        const newJobOrder = new jobOrderModel({
            jobId, device, customerName, issueDescription, status, priority, revenue, deadline
        });

        await newJobOrder.save();
        res.json({ success: true, message: 'Job Order created', jobOrder: newJobOrder });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update job order
export const updateJobOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        // prevent updating userId mapping
        delete updateData.userId;

        const updatedJobOrder = await jobOrderModel.findByIdAndUpdate(id, updateData, { new: true });
        res.json({ success: true, message: 'Job Order updated', jobOrder: updatedJobOrder });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete job order
export const deleteJobOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await jobOrderModel.findByIdAndDelete(id);
        res.json({ success: true, message: 'Job Order deleted' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
