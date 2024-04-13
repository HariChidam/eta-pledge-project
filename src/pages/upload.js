import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../src/styles/index.module.css';
import Link from 'next/link';
import supabase from '../../supabase.js';
import { v4 as uuidv4 } from 'uuid';

export default function Upload() {
  const [activeTab, setActiveTab] = useState('Today');
  const [image, setImage] = useState(null); // Initialize to null
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
        const fileName = uuidv4();
      
        if (!image || !uploaderName) {
            console.error('Please select an image and enter your name.');
            setMessage('Please select an image and enter your name.');
            return;
        }

        try {
            const { error: uploadError } = await supabase.storage
                .from('test')
                .upload(`${fileName}.jpeg`, image, {
                    cacheControl: '3600',
                    contentType: 'image/jpeg',
                    upsert: true
                });

            if (uploadError) {
                throw uploadError;
            }

            const { error: insertError } = await supabase
                .from('photos')
                .insert({
                    uuid: fileName,
                    days_since_uploaded: 0,
                    uploader_name: uploaderName
                });

            if (insertError) {
                throw insertError;
            }

            setMessage('Uploaded successfully!');
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Failed to upload image and name.');
        }
    }

    const handleFileSelection = (event) => {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            setImage(file); // Set the image file
        }
    };

    const handleNameChange = (event) => {
        setUploaderName(event.target.value);
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
      {/* Input for name */}
      <div>
          <input 
              type="text" 
              placeholder="Enter your name" 
              value={uploaderName}
              onChange={handleNameChange}
              className="font-bold text-md bg-[#8b000070] p-2 rounded-md text-center"
          />
      </div>
      {/* Input for file */}
      <div>
          <input 
              type="file" 
              placeholder="Choose your photo"
              onChange={handleFileSelection}
              className="font-bold text-md bg-[#8b000070] p-2 rounded-md text-center"
          />
      </div>
      {/* Submit button */}
      <div>
          <button 
              onClick={uploadPicture}
              className={"font-bold text-md bg-[#8b000070] p-2 rounded-md text-center"}
          >
              Submit
          </button>
      </div>
      {/* Message Display */}
      <div className={styles.centeredText}>Upload Page</div>
      {message && (
          <div className={"font-bold text-md bg-[#8b000070] p-2 rounded-md text-center"}>
              {message}
          </div>
      )}
  </div>
);
}