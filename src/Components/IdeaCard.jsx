function IdeaCard({ idea }) {
  return (
    <div className="idea-card">
      <h2>{idea.title}</h2>
      <p><strong>Category:</strong> {idea.category}</p>
      <p><strong>Difficulty:</strong> {idea.difficulty}</p>
      <p>{idea.description}</p>
      <p><strong>Tech Stack:</strong> {idea.tech_stack.join(', ')}</p>
    </div>
  );
}

export default IdeaCard;