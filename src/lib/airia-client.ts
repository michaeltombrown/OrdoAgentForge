// Airia API Client
// Based on official Airia OpenAPI specification
// Documentation: https://api.airia.ai/docs/

import createClient from 'openapi-fetch';
import type { paths } from './airia-api-types';

const AIRIA_API_URL =
  import.meta.env.VITE_AIRIA_API_URL || 'https://api.airia.ai';
const AIRIA_API_KEY = import.meta.env.VITE_AIRIA_API_KEY;

// Create the API client with proper typing
export const airiaClient = createClient<paths>({
  baseUrl: AIRIA_API_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(AIRIA_API_KEY && { Authorization: `Bearer ${AIRIA_API_KEY}` }),
  },
});

// Helper functions for common operations

/**
 * Get all agent cards with pagination
 */
export async function getAgentCards(params?: {
  PageNumber?: number;
  PageSize?: number;
  SortBy?: string;
  SortDirection?: string;
  Filter?: string;
  projectId?: string;
}) {
  const { data, error } = await airiaClient.GET('/v1/AgentCard', {
    params: {
      query: params,
    },
  });

  if (error) throw new Error('Failed to fetch agent cards');
  return data;
}

/**
 * Get a specific agent card by ID
 */
export async function getAgentCard(agentCardId: string) {
  const { data, error } = await airiaClient.GET('/v1/AgentCard/{agentCardId}', {
    params: {
      path: { agentCardId },
    },
  });

  if (error) throw new Error(`Failed to fetch agent card: ${agentCardId}`);
  return data;
}

/**
 * Get paginated chat spaces
 */
export async function getChatSpaces(params?: {
  PageNumber?: number;
  PageSize?: number;
  SortBy?: string;
  SortDirection?: string;
  Filter?: string;
}) {
  const { data, error } = await airiaClient.GET(
    '/v1/ChatSpaces/PaginatedSpaces',
    {
      params: {
        query: params,
      },
    }
  );

  if (error) throw new Error('Failed to fetch chat spaces');
  return data;
}

/**
 * Create a new chat space
 */
export async function createChatSpace(spaceData: {
  name?: string;
  description?: string;
  [key: string]: unknown;
}) {
  const { data, error } = await airiaClient.POST('/v1/ChatSpaces/CreateSpace', {
    body: spaceData as never,
  });

  if (error) throw new Error('Failed to create chat space');
  return data;
}

/**
 * Get agent evaluation by ID
 */
export async function getAgentEvaluation(id: string) {
  const { data, error } = await airiaClient.GET('/v1/AgentEvaluation/{id}', {
    params: {
      path: { id },
    },
  });

  if (error) throw new Error(`Failed to fetch agent evaluation: ${id}`);
  return data;
}

/**
 * Get projects with pagination
 */
export async function getProjects(params?: {
  PageNumber?: number;
  PageSize?: number;
  SortBy?: string;
  SortDirection?: string;
  Filter?: string;
}) {
  const { data, error } = await airiaClient.GET('/v1/Project/paginated', {
    params: {
      query: params,
    },
  });

  if (error) throw new Error('Failed to fetch projects');
  return data;
}

// Export the client for custom requests
export default airiaClient;
