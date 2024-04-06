import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../src/styles/index.module.css';
import Link from 'next/link';
import supabase from '../../supabase.js';
import { v4 as uuidv4 } from 'uuid';

export default function Upload() {
    const [activeTab, setActiveTab] = useState('Today');
    const [image, setImages] = useState(['upload']);
    const [imageURL, setImageURL] = useState(['null']);
    // Assuming these routes correspond to pages in your Next.js app
    const tabRoutes = {
        'Today': "/",
        'Yesterday': '/yesterday',
        'Two days ago': '/two-days-ago',
        'Later': '/later'
    };

async function uploadPicture() {
    // Generate a unique file name for the upload, to avoid overwriting existing files.
    // This uses the UUID library to generate a unique identifier for each file.
    console.log(supabase);
    const fileName = uuidv4();
    console.log(fileName)

    try {
      const { data, error: uploadError } = await supabase.storage
        .from('test')
        .upload(`${fileName}.jpeg`, image,
        {
          cacheControl: '3600',
          contentType: 'image/jpeg',
          upsert: true
        }
      );

      if (uploadError) {
        console.log(uploadError)
        throw uploadError;
      }

      const { error: insertError } = await supabase
        .from('photos')
        .insert({ uuid: fileName, days_since_uploaded: 0})

  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}

  const handleFileSelection = async (event) => {
      if (event.target.files.length > 0) {
          const file = event.target.files[0];


          if (file.type === "image/jpeg") {
            const image = URL.createObjectURL(file);
            setImages(file)
            setImageURL(Image)
          }
      }
  };

    return (
        <div className={styles.homeContainer}>
          {/* Nav Bar */}
            <div className={styles.tabsContainer}>
                {Object.entries(tabRoutes).map(([tabName, tabPath], index) => (
                    <Link key={index} href={tabPath} passHref>
                        <div
                            className={`${styles.tab} ${activeTab === tabName ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(tabName)}
                        >
                            {tabName}
                        </div>
                    </Link>
                ))}
            </div>
            {/* New Text Block */}


            <div className={styles.centeredText}>Upload Page</div>
            <input type="file" onChange={handleFileSelection} style={{ margin: "400px 200px", display: 'block' }} />
  
            <button className='font-bold text-md bg-[#8b000070] p-2 rounded-md text-center' onClick={uploadPicture}>
                      Submit Picture
            </button>

            {/* Images grid */}
        </div>
    );
}
