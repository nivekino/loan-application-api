import { Router } from 'express';
import { createUser, loginUsers, createCredit, getCredits, getCreditById, updateCredit, deleteCredit } from '../controllers/credit.controller';
const router = Router();

router.post('/credits', createCredit);
router.get('/credits/', getCredits);
router.get('/credits/:id', getCreditById);
router.put('/credits/:id', updateCredit);
router.delete('/credits/:id', deleteCredit);
// router.post('/credits/upload', createCreditWithImage ); // Add this line

// router for users
router.post('/users', createUser);
router.post('/login', loginUsers);

export default router;
