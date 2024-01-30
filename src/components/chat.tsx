'use client';

import React, { useEffect, useState } from 'react';
import tmi from 'tmi.js';

interface Message {
  id: string;
  user: string;
  message: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [channelName, setChannelName] = useState('');

  useEffect(() => {
    if (channelName.length > 0) {
      const client = new tmi.Client({ channels: [channelName] });

      client.connect();

      client.on('message', (channel, tags, message, self) => {
        console.log(message);

        setMessages((messages) => [
          ...messages,
          {
            id: Math.random().toString(36).slice(2, 9),
            message: message,
            user: tags.username ?? '',
          },
        ]);
      });

      return () => {
        client.removeAllListeners();
        client.disconnect();
      };
    }
  }, [channelName]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const name = form.get('channelname') as string;
    console.log(name);

    setMessages([]);
    setChannelName(name);
  }

  return (
    <div>
      <div className="py-8">
        <h1>Canal</h1>

        <form action="" onSubmit={handleSubmit}>
          <input type="text" name="channelname" id="" className="input input-bordered" />
          <button className="btn">Load</button>
        </form>
      </div>

      <div>
        {messages.map((message, index) => (
          <div key={message.id} className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <div className="chat-header">
              {message.user}
              <time className="text-xs opacity-50">12:45</time>
            </div>
            <div className="chat-bubble">{message.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
