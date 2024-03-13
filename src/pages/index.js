import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import isaac from '../../public/isaac.jpeg'; // Verify this path is correct.

export default function Home() {
  const [activeTab, setActiveTab] = useState('Today');
  const tabs = ['Today', 'Yesterday', 'Two days ago', 'Three days ago', 'Four days ago', 'Five days ago', 'Six days ago'];

  useEffect(() => {
    // Your data fetching logic here.
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', maxWidth: '1200px', margin: 'auto', backgroundColor: '#FFFAE1' }}>
      <div style={{ minWidth: '150px', marginRight: '20px' }}>
        {tabs.map((tab, index) => (
          <div key={index} style={{ marginTop: '10px', cursor: 'pointer', color: 'black' }} onClick={() => setActiveTab(tab)}>
            {tab}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', color: 'black', textAlign: 'center' }}>Theta Tau x BeReal</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', width: '100%' }}>
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
              <Image src={isaac} alt={`Placeholder ${index + 1}`} layout="fill" objectFit="cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
