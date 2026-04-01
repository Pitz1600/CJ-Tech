import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

const settingsRouter = express.Router();

settingsRouter.get('/get', getSettings);
settingsRouter.post('/update', updateSettings);

export default settingsRouter;
