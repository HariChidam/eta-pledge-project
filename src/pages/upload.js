import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../src/styles/index.module.css';
import Link from 'next/link';
import supabase from '../../supabase.js';

export default function Home() {
    const [activeTab, setActiveTab] = useState('Today');
    const [images, setImages] = useState(['upload']);

    // Assuming these routes correspond to pages in your Next.js app
    const tabRoutes = {
        'Today': "/",
        'Yesterday': '/yesterday',
        'Two days ago': '/two-days-ago',
        'Later': '/later'
    };

   // useEffect(() => {
   //     const fetchImages = async () => {
   //         const { data, error } = await supabase.from('your-table').select('*');
   //         if (error) {
   //             console.error('Error fetching images:', error);
   //         } else {
   //             setImages(data);
   //         }
   //     };

   //     fetchImages();
   // }, []);

async function uploadPicture(file, date) {
  // Generate a unique file name for the upload, to avoid overwriting existing files.
  // This uses the UUID library to generate a unique identifier for each file.
  const fileName = `${date}-${file.name}`;

  try {
    // Upload the file to the specified bucket in Supabase Storage.
    // Replace 'your-bucket-name' with the actual name of your bucket.
    const { data, error: uploadError } = await supabase.storage
      .from('test')
      .upload(`uploads/${fileName}`, file);

    if (uploadError) {
      throw uploadError;
    }

    // After uploading, you can retrieve the public URL of the file.
    // You might want to save this URL in your Supabase database along with other metadata.
    const { publicURL, error: urlError } = supabase.storage
      .from('test')
      .getPublicUrl(`uploads/${fileName}`);

    if (urlError) {
      throw urlError;
    }

    // Optional: Insert file metadata into a Supabase table for easy access.
    const { error: dbError } = await supabase
      .from('photos')
      .insert([{ name: fileName, url: publicURL, uploaded_at: date }]);

    if (dbError) {
      throw dbError;
    }

    console.log('File uploaded successfully:', publicURL);
    return publicURL; // Return the public URL of the uploaded file.
  } catch (error) {
    console.error('Error uploading file:', error);
    return null; // Indicate failure.
  }
}





   
    const handleFileSelection = async (event) => {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            // Implement your uploadPicture function as needed
            // await uploadPicture(file, "2023-01-01");
        }
    };


    return (
        <div className={styles.homeContainer}>
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

            {/* Images grid */}
            <div className={styles.imagesContainer}>
                {images.map((image, index) => (
                    <div key={index} className={styles.relative}>
                        <Image
                            src={image.url}
                            alt={`Image ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );






}
