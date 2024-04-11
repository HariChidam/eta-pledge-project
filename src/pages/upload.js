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
    const [uploaderName, setUploaderName] = useState('');
    const [message, setMessage] = useState('');

    const tabRoutes = {
      'Today': "/",
      'Yesterday': '/yesterday',
      'Two days ago': '/two-days-ago',
      'Three days ago': '/three-days-ago',
      'Four days ago': '/four-days-ago',
      'Five days ago': '/five-days-ago',
      'Six days ago': '/six-days-ago',
      'Upload': '/upload'
    };

async function uploadPicture() {
    // Generate a unique file name for the upload, to avoid overwriting existing files.
    // This uses the UUID library to generate a unique identifier for each file.
    console.log(supabase);
    const fileName = uuidv4();
    console.log(fileName)
    setMessage('');

      if (!fileName || !uploaderName) {
          // Validate that we have file and name before submit
          console.error('Please select an image and enter your name.');
          return;
      }

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
      .insert(
          { uuid: fileName, days_since_uploaded: 0, uploader_name: uploaderName }// Include the uploaderName in the insert operation
      );
      
      if (insertError) {
        throw insertError;
      }


    setMessage('Uploaded successfully!'); 
    setTimeout(() => {
      setMessage('');
    }, 3000);
    }
     
  catch (error) {
    console.error('Error uploading file:', error);
    setMessage('Failed to upload image and name.');
    
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

  const handleNameChange = (event) => {
    setUploaderName(event.target.value);
};

const messageChange = (event) => {
  setMessage("");
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
            <div>
                <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={uploaderName}
                    onChange={handleNameChange} // Method to update the uploaderName state
                    className="font-bold text-md bg-[#8b000070] p-2 rounded-md text-center" 
                />
            </div>

            <div>
                <input 
                    type="file" 
                    placeholder="Choose your photo" 
                    onClick={handleFileSelection}
                    className="font-bold text-md bg-[#8b000070] p-2 rounded-md text-center" 
                />
            </div>

            <div>
                <button 
                    onClick={uploadPicture}
                    onChange = {messageChange}
                    className={"font-bold text-md bg-[#8b000070] p-2 rounded-md text-center"} // Use your styles
                >
                    Submit
                </button>
            </div>

            <div className={styles.centeredText}>Upload Page
            </div>
            {message && (
                <div className={"font-bold text-md bg-[#8b000070] p-2 rounded-md text-center" }> {/* You should create a new style for this */}
                    {messageChange}
                </div> 
            )} 


            {/* Images grid */}
        </div>
    );
}