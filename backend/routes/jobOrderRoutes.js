import express from 'express';
import { getJobOrders, createJobOrder, updateJobOrder, deleteJobOrder } from '../controllers/jobOrderController.js';

const jobOrderRouter = express.Router();

jobOrderRouter.get('/all', getJobOrders);
jobOrderRouter.post('/create', createJobOrder);
jobOrderRouter.put('/update/:id', updateJobOrder);
jobOrderRouter.delete('/delete/:id', deleteJobOrder);

export default jobOrderRouter;
