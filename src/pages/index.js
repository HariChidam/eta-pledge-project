import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import isaac from '../../public/isaac.jpeg'; // Verify this path is correct.

export default function Home() {
  const [activeTab, setActiveTab] = useState('Today');
  const tabs = ['Today', 'Yesterday', 'Two days ago', 'Three days ago', 'Four days ago', 'Five days ago', 'Six days ago'];
  const names = ['Hari', 'Kate', 'Cate' , 'Eddie' , 'Esben' , 'Isaac', 'Ella', 'George', 'Diego']; //need to figure out how to populate these arrays with data from supabase
  const dates = ['Date 1','Date 2','Date 3','Date 4','Date 5','Date 6','Date 7','Date 8','Date 9']; 
  //we could fill an array with all of the images for a particular date, and then decide which array to use based on the current useState
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
              <div key={index} className="relative group">
                <div className="relative overflow-hidden rounded-lg group-hover:opacity-50 transition-opacity duration-300" style={{ paddingBottom: '100%' }}>
                  <Image src={isaac} alt={`Placeholder ${index + 1}`} layout="fill" objectFit="cover" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-white text-lg font-bold">{names[index]}<br />{dates[index]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  