import { Router } from 'express';
import { createTimer, getTimers, getTimer, updateTimer, deleteTimer, toggleTimerActiveStatus } from '../controllers/timerControllers.js';

const router = Router();

router.post('/', createTimer);
router.get('/', getTimers);
router.get('/:id', getTimer);
router.put('/:id', updateTimer);
router.delete('/:id', deleteTimer);
router.post('/:id/activate', toggleTimerActiveStatus);

export default router;