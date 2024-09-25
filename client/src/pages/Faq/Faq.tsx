import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import './Faq.css';

const faqData = [
  {
    question: "What is Quan C?",
    answer: `
      Quan C is an open-source learning application that helps you to learn how to build a secure code.
    `,
  },
  {
    question: "Is Quan C challenges beginner friendly?",
    answer: `
      Most of Quan C challenges are beginner friendly that you can learn while learning a programming language. However, there are some challenges that require programming fundamental skills in order to complete the challenge.
    `,
  },
  {
    question: "What kind of challenges does Quan C have?",
    answer: `
      Currently, we have 3 vulnerabilities (SQL Injection, Local File Injection, and Server Side Template Injection) with various programming languages. The languages that have been implemented are PHP, Python, and JavaScript. The challenges will increase in variety and along with the languages in the future.
    `,
  },
  {
    question: "How do I collaborate in creating a challenge?",
    answer: `
      You can send us the details of the cases that have been created with guidance in the <a href="/collaborate" class="text-cyan-100 dark:text-cyan-100 hover:underline">Collaborate With Us</a> page.
    `,
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div 
      id="accordion-flush" 
      className="faq-container-margin"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }}
    >
      <div className="text-center">
        <h1 className='text-7xl text-cyan-100'>FAQ</h1>
        <p className='text-white text-xl mt-4'>Got questions? We got answers.</p>
      </div>

      <div className="mt-8">
        {faqData.map((item, index) => (
          <div key={index}>
            <h2 id={`accordion-flush-heading-${index}`}>
              <button
                type="button"
                className={`flex items-center justify-between w-full py-5 font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3 ${activeIndex === index ? 'text-gray-900 dark:text-white' : ''}`}
                onClick={() => toggleAccordion(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`accordion-flush-body-${index}`}
              >
                <span className='faq-text-mobile'>{item.question}</span>
                <svg
                  data-accordion-icon
                  className={`w-3 h-3 shrink-0 ${activeIndex === index ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                </svg>
              </button>
            </h2>
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  id={`accordion-flush-body-${index}`}
                  className="py-5 border-b text-white border-gray-200 dark:border-gray-700"
                  aria-labelledby={`accordion-flush-heading-${index}`}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.answer) }}
                  initial={{ maxHeight: 0, opacity: 0 }}
                  animate={{ maxHeight: '500px', opacity: 1 }}
                  exit={{ maxHeight: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
