import React from 'react'
import { FaDiscord } from 'react-icons/fa';
import "./Community.css"

const Community = () => {

  const discord_link = "https://discord.com/invite/5ZUsk7q5vq";

  const handleClick = () => {
    window.location.href = discord_link;
  };

  const heading = <h1 className='text-6xl'>Developers <br /> <span className='text-cyan-100'>Together</span> Strong</h1>;

  const desc = <p className='mt-8 ms-2'>Join Our Community in Discord to learn and <br /> gather knowledges with other developers</p>;
  
  const join_button = <button className='flex ms-2 mt-4 p-3 text-xl rounded-lg bg-cyan-100 text-black hover:opacity-75' onClick={handleClick} >
    <FaDiscord className='mt-0.5 me-2 text-2xl' />
    Join Our Discord
  </button>

  return (
    <div className='flex mt-56 text-white flex-mobile'>
      <div
        aria-hidden="true"
        className="absolute top-1-mobile z-0 left-mobile w-[300px] h-[300px] rounded-full bg-gradient-to-b from-cyan-100 to-blue-100 blur-[140px] opacity-75"
      ></div>
      <div
        aria-hidden="false"
        className="absolute top-2-mobile z-0 right-[0px] w-[300px] h-[300px] rounded-full bg-gradient-to-b from-cyan-100 to-blue-100 blur-[140px] opacity-75"
      ></div>
      <div className="z-10">
        <img
          src={`${process.env.PUBLIC_URL}/discord.png`}
          alt="Secure Device"
          className="width-mobile max-w-3xl"
        />
      </div>
      <div className="margin-mobile mt-28">
        {heading}
        {desc}
        {join_button}
      </div>
    </div>
  )
}

export default Community