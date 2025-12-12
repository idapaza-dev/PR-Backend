
import { Router } from 'express';
import { register, login, requestRescuerRole } from '../controllers/authController.js';
import { authJWT, requireRole } from '../middlewares/authJWT.js';
import { listCats, createCat, updateCat } from '../controllers/catsController.js';
import { createAdoption, listMyAdoptions, manageAdoption } from '../controllers/adoptionsController.js';
import { suggestTags, recommendations } from '../controllers/mlController.js';
import { listUsers, approveRescuer } from '../controllers/adminController.js';
import { publishToNetworks } from '../controllers/socialController.js';

const router = Router();

// Salud
router.get('/health', (_req, res) => res.json({ ok: true }));

// Auth
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/request-rescuer', authJWT, requestRescuerRole);

// Cats
router.get('/cats', listCats);
router.post('/cats', authJWT, requireRole('rescatista','admin'), createCat);
router.patch('/cats/:id', authJWT, requireRole('rescatista','admin'), updateCat);
router.post('/cats/:id/publish', authJWT, requireRole('rescatista','admin'), publishToNetworks);

// Adoptions
router.post('/adoptions', authJWT, requireRole('adoptante'), createAdoption);
router.get('/adoptions/mine', authJWT, requireRole('adoptante'), listMyAdoptions);
router.patch('/adoptions/:id', authJWT, requireRole('rescatista','admin'), manageAdoption);

// ML
router.post('/ml/autotag', authJWT, suggestTags);
router.get('/ml/recommendations', authJWT, requireRole('adoptante'), recommendations);

// Admin
router.get('/admin/users', authJWT, requireRole('admin'), listUsers);
router.post('/admin/approve-rescuer', authJWT, requireRole('admin'), approveRescuer);

export default router;
