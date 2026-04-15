import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AwakeningStep5() {
  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-blue-50"
      style={{ borderRadius: '0px' }}
    >
      {/* 小窝场景图片 */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius: '0px' }}
      >
        <img
          src="/xiaowo.png"
          alt="小窝场景"
          className="absolute inset-0 w-full h-full"
          style={{
            borderRadius: '0px',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>
    </div>
  );
}
