import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import "./Collaborate.css"

const Collaborate = () => {
  const [guidelines, setGuidelines] = useState<string>("");

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/Guidelines.md`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => setGuidelines(data))
      .catch((error) =>
        console.error("[-] Error fetching the file:", error)
      );
  }, []);

  return (
    <div 
      className="collaborate-container-margin lg:flex lg:justify-center"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }}
    >
      <div className="prose lg:prose-xl prose-headings:text-white prose-p:text-white prose-a:text-cyan-100 prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-cyan-100 prose-blockquote:text-white prose-strong:text-white">
        <ReactMarkdown>
          {guidelines}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Collaborate;
