import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../src/styles/index.module.css';
import Link from 'next/link';
import supabase from '../../supabase.js';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Four days ago');
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

  const [photoIds, setPhotoIds] = useState([]);
  const [photoData, setPhotoData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {

    const fetchAllPhotosLater = async () => {
      setLoading(true); // Begin loading
      try {
        const { data, error } = await supabase
          .from('photos')
          .select('*')
          .eq('days_since_uploaded', 4);

        if (error) {
          throw error;
        }

        if (data) {
          // Process all downloads concurrently using Promise.all
          const downloadPromises = data.map(photo => supabase
            .storage
            .from('test')
            .download(`${photo.uuid}.jpeg`)
          );

          const downloadResponses = await Promise.all(downloadPromises.map(p => p.catch(e => e)));
          
          const validData = downloadResponses.filter((response) => !(response instanceof Error));

          // Assuming downloaded data includes URLs to the images
          setPhotoData(validData.map(d => URL.createObjectURL(d.data)));
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false); // End loading regardless of result
      }
    }; 

    // Start the interval only after initial photos are loaded
    fetchAllPhotosLater();

  }, []);
  return (
    <div className={styles.homeContainer}>
      <div className={styles.tabsContainer}>
        {Object.entries(tabRoutes).map(([tabName, tabPath], index) => (
          <Link key={index} href={tabPath} passHref>
            <div
              className={styles.tab}
              onClick={() => setActiveTab(tabName)}
            >
              {tabName}
            </div>
          </Link>
        ))}
      </div>
      <div className={styles.tabContent}>
        <h1 className={styles.title}>THETA TAKES</h1>
        {isLoading ? (
          <div>Loading photos...</div> // Replace with a visual loading spinner if desired
        ) : (
          <div className={styles.gridContainer}>
            {photoData.map((photo, index) => (
              <div key={index} className={styles.relative}>
                <div className={`${styles.overflowHidden} ${styles.group}`}>
                  <Image
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}