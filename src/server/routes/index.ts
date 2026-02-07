import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { verifyClerkWebhook } from '../middleware/clerkWebhookMiddleware';

// Import controllers
import * as authController from '../controllers/authController';
import * as userController from '../controllers/userController';
import * as organizationController from '../controllers/organizationController';
import * as workspaceController from '../controllers/workspaceController';
import * as toolController from '../controllers/toolController';
import * as toolAccessController from '../controllers/toolAccessController';
import * as analyticsController from '../controllers/analyticsController';
import * as documentController from '../controllers/documentController';

// Import schemas
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  addWorkspaceMemberSchema,
} from '../schemas/workspaceSchemas';
import {
  createToolSchema,
  updateToolSchema,
  executeToolSchema,
} from '../schemas/toolSchemas';
import {
  assignToolToOrganizationSchema,
  assignToolToWorkspaceSchema,
  assignToolToUserSchema,
} from '../schemas/toolAccessSchemas';
import { createUserSchema, updateUserSchema } from '../schemas/userSchemas';

const router = Router();

// ============================================
// AUTH ROUTES
// ============================================
// Webhook endpoint (with Clerk signature verification)
router.post('/auth/webhook', verifyClerkWebhook, authController.handleWebhook);

// Protected auth routes
router.get('/auth/me', authMiddleware, authController.getCurrentUser);
router.patch('/auth/me', authMiddleware, authController.updateCurrentUser);

// ============================================
// USER ROUTES
// ============================================
router.post(
  '/users',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN', 'ORG_OWNER']),
  validate(createUserSchema),
  userController.createUser
);

router.get('/users', authMiddleware, userController.listUsers);

router.get('/users/:id', authMiddleware, userController.getUser);

router.patch(
  '/users/:id',
  authMiddleware,
  validate(updateUserSchema),
  userController.updateUser
);

router.delete(
  '/users/:id',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN', 'ORG_OWNER']),
  userController.deleteUser
);

// ============================================
// ORGANIZATION ROUTES
// ============================================
router.post(
  '/organizations',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN']),
  organizationController.createOrganization
);

router.get(
  '/organizations',
  authMiddleware,
  organizationController.listOrganizations
);

router.get(
  '/organizations/:id',
  authMiddleware,
  organizationController.getOrganization
);

router.patch(
  '/organizations/:id',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN', 'ORG_OWNER']),
  organizationController.updateOrganization
);

router.delete(
  '/organizations/:id',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN']),
  organizationController.deleteOrganization
);

// ============================================
// WORKSPACE ROUTES
// ============================================
router.post(
  '/workspaces',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN', 'ORG_OWNER', 'WORKSPACE_ADMIN']),
  validate(createWorkspaceSchema),
  workspaceController.createWorkspace
);

router.get(
  '/workspaces',
  authMiddleware,
  workspaceController.getUserWorkspaces
);

router.get('/workspaces/:id', authMiddleware, workspaceController.getWorkspace);

router.patch(
  '/workspaces/:id',
  authMiddleware,
  validate(updateWorkspaceSchema),
  workspaceController.updateWorkspace
);

router.delete(
  '/workspaces/:id',
  authMiddleware,
  workspaceController.deleteWorkspace
);

router.post(
  '/workspaces/:id/members',
  authMiddleware,
  validate(addWorkspaceMemberSchema),
  workspaceController.addMember
);

router.delete(
  '/workspaces/:id/members/:userId',
  authMiddleware,
  workspaceController.removeMember
);

// ============================================
// TOOL ROUTES
// ============================================
router.post(
  '/tools',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN']),
  validate(createToolSchema),
  toolController.createTool
);

router.get('/tools', authMiddleware, toolController.getUserTools);

router.get('/tools/:id', authMiddleware, toolController.getTool);

router.patch(
  '/tools/:id',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN']),
  validate(updateToolSchema),
  toolController.updateTool
);

router.delete(
  '/tools/:id',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN']),
  toolController.deleteTool
);

router.post(
  '/tools/:id/execute',
  authMiddleware,
  validate(executeToolSchema),
  toolController.executeTool
);

// ============================================
// TOOL ACCESS ROUTES
// ============================================
router.post(
  '/tool-access/organization',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN']),
  validate(assignToolToOrganizationSchema),
  toolAccessController.assignToOrganization
);

router.post(
  '/tool-access/workspace',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN', 'ORG_OWNER']),
  validate(assignToolToWorkspaceSchema),
  toolAccessController.assignToWorkspace
);

router.post(
  '/tool-access/user',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN', 'ORG_OWNER']),
  validate(assignToolToUserSchema),
  toolAccessController.assignToUser
);

router.delete(
  '/tool-access/:id',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN', 'ORG_OWNER']),
  toolAccessController.removeAccess
);

router.get(
  '/tool-access/audit/:toolId',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN']),
  toolAccessController.getAccessAudit
);

// ============================================
// ANALYTICS ROUTES
// ============================================
router.get(
  '/analytics/user',
  authMiddleware,
  analyticsController.getUserAnalytics
);

router.get(
  '/analytics/workspace/:workspaceId',
  authMiddleware,
  analyticsController.getWorkspaceAnalytics
);

router.get(
  '/analytics/organization/:organizationId',
  authMiddleware,
  analyticsController.getOrganizationAnalytics
);

router.get(
  '/analytics/system',
  authMiddleware,
  requireRole(['SYSTEM_ADMIN']),
  analyticsController.getSystemAnalytics
);

// ============================================
// DOCUMENT ROUTES
// ============================================
router.post('/documents', authMiddleware, documentController.uploadDocument);

router.get('/documents', authMiddleware, documentController.listDocuments);

router.get('/documents/:id', authMiddleware, documentController.getDocument);

router.delete(
  '/documents/:id',
  authMiddleware,
  documentController.deleteDocument
);

router.get(
  '/documents/:id/url',
  authMiddleware,
  documentController.getDocumentUrl
);

export default router;
