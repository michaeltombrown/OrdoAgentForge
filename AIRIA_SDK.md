# Airia API Integration

## ✅ Status: Fully Integrated!

The Airia API has been successfully integrated into your project with full TypeScript support!

## What's Been Set Up:

### 1. TypeScript SDK Generated

- ✅ **Generated from Official OpenAPI Spec** (`airia-openapi.json`)
- ✅ **Type-safe API client** with full autocomplete
- ✅ **Helper functions** for common operations
- ✅ **Location**: `src/lib/airia-client.ts`

### 2. API Types

- ✅ **Complete type definitions** at `src/lib/airia-api-types.ts`
- ✅ **Auto-generated** from official Airia OpenAPI spec
- ✅ **Covers all endpoints** and data models

### 3. Configuration

- ✅ Environment variables configured
- ✅ VS Code autocomplete support
- ✅ Ready for deployment

## Configuration:

### Environment Variables

Add to your `.env.local` file:

```bash
VITE_AIRIA_API_URL=https://api.airia.ai
VITE_AIRIA_API_KEY=your-api-key-here
```

### Get Your API Key

Contact your Airia representative or visit: https://api.airia.ai/docs/

## Available Endpoints:

The SDK includes helper functions for:

### Agent Management

- `getAgentCards()` - Get all agent cards
- `getAgentCard(id)` - Get specific agent
- `getAgentEvaluation(id)` - Get evaluation results

### Chat & Spaces

- `getChatSpaces()` - Get paginated chat spaces
- `createChatSpace(data)` - Create new chat space

### Projects

- `getProjects()` - Get paginated projects

### And Many More!

- Agent Evaluations
- Agent Swarms
- Data Sources
- Embeddings
- Files & Knowledge
- Pipelines
- Voice Chat
- And 100+ more endpoints...

## Usage Examples:

### Basic Usage

```typescript
import { getAgentCards, getProjects, airiaClient } from '@/lib/airia-client';

// Get agent cards
const agents = await getAgentCards({
  PageNumber: 1,
  PageSize: 10,
  Filter: 'active',
});

// Get projects
const projects = await getProjects({
  PageNumber: 1,
  PageSize: 20,
});
```

### Using in React Components

```typescript
import { useState, useEffect } from 'react';
import { getAgentCards } from '@/lib/airia-client';

function AgentList() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgents() {
      try {
        const data = await getAgentCards({ PageSize: 10 });
        setAgents(data);
      } catch (error) {
        console.error('Failed to load agents:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAgents();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {agents.map(agent => (
        <div key={agent.id}>{agent.name}</div>
      ))}
    </div>
  );
}
```

### Custom API Calls

For endpoints not covered by helper functions:

```typescript
import airiaClient from '@/lib/airia-client';

// Make a custom GET request
const { data, error } = await airiaClient.GET('/v1/SomeEndpoint/{id}', {
  params: {
    path: { id: 'some-id' },
    query: { filter: 'value' },
  },
});

// Make a POST request
const { data, error } = await airiaClient.POST('/v1/SomeEndpoint', {
  body: {
    name: 'Test',
    description: 'Example',
  },
});
```

## API Documentation:

- **Official Docs**: https://api.airia.ai/docs/
- **Base URL**: https://api.airia.ai
- **OpenAPI Spec**: `airia-openapi.json` (in project root)

## Key Features:

✅ **Type Safety** - Full TypeScript support with autocomplete  
✅ **Auto-generated** - From official OpenAPI specification  
✅ **100+ Endpoints** - Complete API coverage  
✅ **Easy to Use** - Simple helper functions  
✅ **Flexible** - Direct client access for custom needs  
✅ **Production Ready** - Proper error handling

## Updating the SDK:

If Airia updates their API:

```bash
# Download new OpenAPI spec to airia-openapi.json
# Then regenerate types:
npx openapi-typescript airia-openapi.json -o src/lib/airia-api-types.ts
```

## Available API Categories:

- **AgentCard** - Agent management
- **AgentDiscovery** - Agent discovery
- **AgentEvaluation** - Evaluation & testing
- **AgentFeedback** - User feedback
- **AgentSteps** - Agent workflows
- **AgentSwarms** - Multi-agent orchestration
- **AgentTrigger** - Event triggers
- **ChatSpaces** - Chat & collaboration
- **DataSource** - Data connections
- **Embedding** - Vector embeddings
- **File** - File management
- **Knowledge** - Knowledge base
- **Pipeline** - Workflow pipelines
- **Project** - Project management
- **VoiceChat** - Voice interactions
- And many more...

## Need Help?

- Check the TypeScript types for autocomplete
- Review the OpenAPI spec: `airia-openapi.json`
- Visit: https://api.airia.ai/docs/
- Contact Airia support

---

**Status**: ✅ Fully Integrated and Ready to Use!
