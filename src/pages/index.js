import React, { useState, useEffect } from "react";
import Image from "next/image";
import isaac from "../../public/isaac.jpeg";
// Assuming supabase is set up correctly
import supabase from "../../supabase";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Today");
  const tabs = ["Today", "Yesterday", "Two days ago", "Three days ago", "Four days ago", "Five days ago", "Six days ago"];

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase.from('test').select('*');
      if (data) {
        console.log(data);
      }
      if (error) {
        console.error("Error fetching photos:", error.message);
      }
    };
    fetchPhotos();
  }, []);

  return (


    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '1200px', margin: 'auto' }}>
      {/* Tabs on the left */}
      <div style={{}}>
          {tabs.map((tab, index) => (
            <div key={index} style={{ marginBottom: '10px', cursor: 'pointer' }} onClick={() => setActiveTab(tab)}>
              {tab} 
            </div> 
          ))}
        </div>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', marginBottom: '20px' }}>

       

        {/* Title */}
        <h1 style={{ flex: '2', textAlign: 'center', fontSize: '24px' }}>Theta Tau x BeReal</h1>
      </div>
      {/* Photos in a 3x3 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', width: '100%' }}>
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ marginBottom: '10px' }}>{`Submitter ${index + 1}`}</span>
            <Image src={isaac} alt={`Placeholder ${index + 1}`} width={150} height={150} objectFit="cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
