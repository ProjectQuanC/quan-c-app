import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface ChallengeDescriptionProps {
  repo_link: string;
}

const ChallengeDescription: React.FC<ChallengeDescriptionProps> = ({ repo_link }) => {
  const [challengeDescription, setChallengeDescription] = useState<string | null>(null);

  useEffect(() => {
    const fetchReadmeFromGitHub = async () => {
      const formattedRepoLink = repo_link.split("github.com/")[1];
      if (!formattedRepoLink) return;
      try {
        const response = await fetch(`https://raw.githubusercontent.com/${formattedRepoLink}/main/README.md`);
        if (response.ok) {
          const readmeText = await response.text();
          setChallengeDescription(readmeText || null); // Set null if description is empty
        } else {
          console.error('Failed to fetch README');
          setChallengeDescription(null); // Handle if README is not found
        }
      } catch (error) {
        console.error('Error fetching README:', error);
        setChallengeDescription(null); // Handle error case
      }
    };

    fetchReadmeFromGitHub();
  }, [repo_link]);

  return (
    <div className="
      prose 
      lg:prose-xl 
      prose-headings:text-white 
      prose-p:text-white 
      prose-li:text-white 
      prose-a:text-cyan-100 
      prose-a:underline 
      prose-blockquote:border-l-4 
      prose-blockquote:border-cyan-100 
      prose-blockquote:text-white 
      prose-strong:text-white 
      prose-code:text-white
    ">
      {challengeDescription ? (
        <ReactMarkdown>
          {challengeDescription}
        </ReactMarkdown>
      ) : (
        <p className="text-yellow-300">Challenge description not found. Please check the repository or contact support for more information.</p>
      )}
    </div>
  );
};

export default ChallengeDescription;