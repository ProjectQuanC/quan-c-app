import React, { useState, useEffect, useRef } from 'react';
import { FaCopy } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline, IoMdClose } from 'react-icons/io';

interface ChallengeDescriptionProps {
  repo_link: string;
}

export default function RepoClone({ repo_link }: ChallengeDescriptionProps) {
  const [showCopyModal, setShowCopyModal] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleCopyRepoLink = () => {
    if (repo_link) {
      navigator.clipboard.writeText(`${repo_link}.git`);
      setShowCopyModal(true);
    }
  };

  useEffect(() => {
    if (showCopyModal) {
      const timer = setTimeout(() => setShowCopyModal(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showCopyModal]);

  return (
    <div className="relative">
      <div className="mb-6 mt-12">
        <h3 className="text-4xl text-white font-semibold mb-4">Repository Link</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            id="repoLink"
            value={`${repo_link}.git`}
            readOnly
            className="flex-grow px-4 py-3 rounded-md bg-[#1f2937] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            ref={buttonRef}
            onClick={handleCopyRepoLink}
            className="px-6 py-3 bg-blue-500 flex text-white rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1f2937]"
          >
            <FaCopy className='me-2 mt-1' /> Copy
          </button>
        </div>
      </div>

      {showCopyModal && (
        <div
          className="absolute z-10 bg-background-default rounded-lg shadow-lg p-4 mt-2 right-0 w-64 transform transition-all duration-300 ease-in-out"
          style={{
            top: buttonRef.current ? buttonRef.current.offsetHeight + 4 : 0,
          }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
            <IoMdCheckmarkCircleOutline className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">Link copied!</p>
              <p className="mt-1 text-sm text-gray-500">
                The repository link has been copied to your clipboard.
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="bg-background-default rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowCopyModal(false)}
              >
                <span className="sr-only">Close</span>
                <IoMdClose className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}