import { Request, Response, NextFunction } from 'express';
import { Webhook } from 'svix';

/**
 * Clerk Webhook Verification Middleware
 * Verifies the signature of incoming Clerk webhooks
 */
export const verifyClerkWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error('CLERK_WEBHOOK_SECRET is not set in environment variables');
      res.status(500).json({ error: 'Webhook secret not configured' });
      return;
    }

    // Get the headers
    const svix_id = req.headers['svix-id'] as string;
    const svix_timestamp = req.headers['svix-timestamp'] as string;
    const svix_signature = req.headers['svix-signature'] as string;

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      res.status(400).json({ error: 'Missing Svix headers' });
      return;
    }

    // Get the body
    const payload = JSON.stringify(req.body);

    // Create a new Svix instance with your webhook secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: unknown;

    try {
      // Verify the webhook signature
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      res.status(400).json({ error: 'Invalid webhook signature' });
      return;
    }

    // Webhook is verified, attach the event to the request
    req.body = evt;
    next();
  } catch (error) {
    console.error('Webhook verification error:', error);
    res.status(500).json({ error: 'Webhook verification failed' });
  }
};
