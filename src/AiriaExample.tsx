import { useState, useEffect } from 'react';
import { getAgentCards, getProjects } from './lib/airia-client';

interface Agent {
  id?: string;
  name?: string;
  description?: string | null;
}

interface Project {
  id?: string;
  name?: string;
}

function AiriaExample() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Fetch agents and projects in parallel
        const [agentsData, projectsData] = await Promise.all([
          getAgentCards({ PageNumber: 1, PageSize: 5 }),
          getProjects({ PageNumber: 1, PageSize: 5 }),
        ]);

        setAgents(agentsData || []);
        setProjects(projectsData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading Airia data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="airia-example">
        <h2>Loading Airia Data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="airia-example error">
        <h2>Error</h2>
        <p>{error}</p>
        <p className="hint">
          Make sure VITE_AIRIA_API_KEY is set in your .env.local file
        </p>
      </div>
    );
  }

  return (
    <div className="airia-example">
      <h2>Airia API Integration</h2>

      <section>
        <h3>Agent Cards ({agents.length})</h3>
        <ul>
          {agents.map((agent) => (
            <li key={agent.id}>
              <strong>{agent.name || 'Unnamed Agent'}</strong>
              <p>{agent.description || 'No description'}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Projects ({projects.length})</h3>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>{project.name || 'Unnamed Project'}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AiriaExample;
