import { useEffect } from 'react';

function IdeaCard({ idea }) {
  // 1) DEBUG: see exactly what props you're getting
  useEffect(() => {
    console.log('[IdeaCard] idea prop:', idea);
  }, [idea]);

  // 2) Normalize similarProjects into a proper array
  let similar = [];
  if (Array.isArray(idea.similarProjects)) {
    similar = idea.similarProjects;
  } else if (typeof idea.similarProjects === 'string') {
    try {
      similar = JSON.parse(idea.similarProjects);
    } catch (e) {
      console.error('Failed to parse similarProjects JSON:', e);
    }
  }

  return (
    <div className="idea-card fade-in">
      <h2>{idea.title}</h2>
      <p>{idea.description}</p>
      <div><strong>Industry:</strong> {idea.industry}</div>
      <div><strong>Type:</strong> {idea.type}</div>
      <div><strong>Difficulty:</strong> {idea.difficulty}</div>
      <div>
        <strong>Roles:</strong>{' '}
        {Array.isArray(idea.roles)
          ? idea.roles.join(', ')
          : idea.roles || 'No roles specified'}
      </div>
      <div>
        <strong>Technologies:</strong>{' '}
        {Array.isArray(idea.technologies)
          ? idea.technologies.join(', ')
          : idea.technologies || 'No technologies listed'}
      </div>

      <div>
        <strong>Similar Projects:</strong>
        <ul>
          {similar.length > 0 ? (
            similar.map((url, idx) => (
              <li key={idx}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="similar-link"
                >
                  {url}
                </a>
              </li>
            ))
          ) : (
            <li>No similar projects</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default IdeaCard;