import React from 'react';
import { IoIosMail } from 'react-icons/io';
import './Footer.css';

const Footer = () => {

  const navigation = [
    { name: "About Us", link: "/" },
    { name: "FAQ", link: "/faq" },
    { name: "Challenge List", link: "/challenge-list" },
    { name: "Collaborate with Us", link: "/collaborate" }
  ];

  const policy = [
    { name: "Privacy Policy", link: "/" }
  ];

  const mail_desc = "If you have a question about our platform, business or press enquiries, please get in touch via the email address below.";

  const email = "project.quanc@gmail.com";

  const imageButtons = [
    { src: `${process.env.PUBLIC_URL}/quan-c-logo-mini.svg`, link: "http://localhost:3000", alt: "Image 1" },
    { src: `${process.env.PUBLIC_URL}/discord.svg`, link: "https://discord.com/invite/5ZUsk7q5vq", alt: "Image 2" },
  ];

  const copyright = " @ Copyright 2024 Quan C. All rights reserved"

  return (
    <div className="bg-background-footer">
      <div className="flex padding-mobile justify-between flex-mobile">
        <div className="text-white flex flex-col gap-mobiles">
          <h1 className='text-lg font-bold mb-4'>Content</h1>
          <ul className='flex flex-col gap-4'>
            {navigation.map((item, index) => (
              <li key={index} className="mb-2">
                <a 
                  href={item.link} 
                  className="text-white text-base underline hover:text-cyan-100"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-white flex flex-col gap-mobiles">
          <h1 className='text-lg font-bold mb-4'>Policy</h1>
          <ul className='flex flex-col gap-4'>
            {policy.map((item, index) => (
              <li key={index} className="mb-2">
                <a 
                  href={item.link} 
                  className="text-white text-base underline hover:text-cyan-100"
                >
                  {item.name}
                </a>
              </li>
            ))}    
          </ul>
        </div>
        <div className="text-white flex flex-col gap-8 max-w-sm">
          <img
            src={`${process.env.PUBLIC_URL}/quan-c-footer.svg`}
            alt="Secure Device"
            className="w-[40%]"
          />
          <div>
            <p className="mb-4">{mail_desc}</p>
            <a 
              href={`mailto:${email}`} 
              className="text-white hover:text-cyan-100 underline flex"
            >
              <IoIosMail className='mt-1.5 me-2' />
              {email}
            </a>
          </div>
          <div>
            <hr className='border-t-2 border-white mt-2' />
          </div>
          <div className="flex gap-4 mt-2">
            {imageButtons.map((button, index) => (
              <a 
                key={index} 
                href={button.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block w-[10%] p-2 bg-cyan-100 rounded-lg overflow-hidden"
              >
                <img 
                  src={button.src} 
                  alt={button.alt} 
                  className="w-[100%] max-w-full h-auto"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="pb-12 text-white text-footer-mobile ">
        {copyright}
      </div>
    </div>
  );
}

export default Footer;
