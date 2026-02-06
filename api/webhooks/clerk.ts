import { Webhook } from 'svix';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Webhook types from Clerk
type WebhookEvent = {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    first_name?: string;
    last_name?: string;
    image_url?: string;
    [key: string]: unknown;
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the webhook secret from environment variables
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  // Get the Svix headers for verification
  const svix_id = req.headers['svix-id'] as string;
  const svix_timestamp = req.headers['svix-timestamp'] as string;
  const svix_signature = req.headers['svix-signature'] as string;

  // If there are no Svix headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Missing Svix headers' });
  }

  // Get the body
  const body = JSON.stringify(req.body);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the webhook signature
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Initialize Supabase client
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase credentials not configured');
    return res.status(500).json({ error: 'Database not configured' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Handle the webhook
  const { type, data } = evt;
  const clerkUserId = data.id;

  try {
    switch (type) {
      case 'user.created': {
        // Create user in Supabase when a new user signs up in Clerk
        const email = data.email_addresses?.[0]?.email_address;
        const firstName = data.first_name || '';
        const lastName = data.last_name || '';
        const avatarUrl = data.image_url || '';

        if (!email) {
          console.error('No email found for user:', clerkUserId);
          return res.status(400).json({ error: 'No email found' });
        }

        // Insert user into users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert({
            clerk_user_id: clerkUserId,
            email,
            full_name: `${firstName} ${lastName}`.trim(),
            avatar_url: avatarUrl,
          })
          .select()
          .single();

        if (userError) {
          console.error('Error creating user in Supabase:', userError);
          return res.status(500).json({ error: 'Failed to create user' });
        }

        console.log('User created:', userData);

        // Create default organization for the user
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: `${firstName || email.split('@')[0]}'s Organization`,
            owner_id: userData.id,
          })
          .select()
          .single();

        if (orgError) {
          console.error('Error creating organization:', orgError);
          return res
            .status(500)
            .json({ error: 'Failed to create organization' });
        }

        console.log('Organization created:', orgData);

        // Add user as admin member of the organization
        const { error: memberError } = await supabase
          .from('organization_members')
          .insert({
            organization_id: orgData.id,
            user_id: userData.id,
            role: 'admin',
          });

        if (memberError) {
          console.error('Error adding user to organization:', memberError);
          return res
            .status(500)
            .json({ error: 'Failed to add user to organization' });
        }

        console.log('User added to organization as admin');
        break;
      }

      case 'user.updated': {
        // Update user in Supabase when user is updated in Clerk
        const email = data.email_addresses?.[0]?.email_address;
        const firstName = data.first_name || '';
        const lastName = data.last_name || '';
        const avatarUrl = data.image_url || '';

        const { error: updateError } = await supabase
          .from('users')
          .update({
            email,
            full_name: `${firstName} ${lastName}`.trim(),
            avatar_url: avatarUrl,
          })
          .eq('clerk_user_id', clerkUserId);

        if (updateError) {
          console.error('Error updating user in Supabase:', updateError);
          return res.status(500).json({ error: 'Failed to update user' });
        }

        console.log('User updated:', clerkUserId);
        break;
      }

      case 'user.deleted': {
        // Soft delete or handle user deletion
        const { error: deleteError } = await supabase
          .from('users')
          .delete()
          .eq('clerk_user_id', clerkUserId);

        if (deleteError) {
          console.error('Error deleting user from Supabase:', deleteError);
          return res.status(500).json({ error: 'Failed to delete user' });
        }

        console.log('User deleted:', clerkUserId);
        break;
      }

      default:
        console.log('Unhandled webhook event type:', type);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
