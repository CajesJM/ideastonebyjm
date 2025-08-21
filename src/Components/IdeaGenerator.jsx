import { useState } from 'react';
import Ideas from '../Data/Ideas.json';
import IdeaCard from './IdeaCard';

function IdeaGenerator() {
  const [selectedIdea, setSelectedIdea] = useState(null);

  const generateIdea = () => {
    const index = Math.floor(Math.random() * Ideas.length);
    setSelectedIdea(Ideas[index]);
  };

  return (
    <div>
      <button onClick={generateIdea}>🎲 Generate Capstone Idea</button>
      {selectedIdea && <IdeaCard idea={selectedIdea} />}
    </div>
  );
}

export default IdeaGenerator;