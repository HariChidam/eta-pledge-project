import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../src/styles/index.module.css';
import Link from 'next/link';
import supabase from '../../supabase.js';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Later');
  const tabRoutes = {
    'Today': "/",
    'Yesterday': '/yesterday',
    'Two days ago': '/two-days-ago',
    'Later': '/later',
    'Upload': '/upload'
  };

  const [photoIds, setPhotoIds] = useState([]);
  const [photoData, setPhotoData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [intervalPhotos, setIntervalPhotos] = useState([]);

  useEffect(() => {
    let intervalId;

    const fetchAllPhotosLater = async () => {
      setLoading(true); // Begin loading
      try {
        const { data, error } = await supabase
          .from('photos')
          .select('*')
          .gte('days_since_uploaded', 3);

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

    const updatePhotoDays = async () => {
      try {
        const { data: intervalData, error: intervalError } = await supabase
          .from('photos')
          .select('*')

        if (intervalError) {
          throw intervalError;
        }

        if (intervalData) {
          
         let oldData = intervalData.filter(photo => photo.days_since_uploaded >= 100);
          const deleteOldPhotos = oldData.map(photo =>
            supabase
              .from('photos')
              .delete()
              .eq('uuid', photo.uuid)
          );

          // delete from storage too

          // Execute all updates in parallel using Promise.all and map
          let goodData = intervalData.filter(photo => photo.days_since_uploaded < 100);
          const updatePromises = goodData.map(photo =>
            supabase
              .from('photos')
              .update({ days_since_uploaded: photo.days_since_uploaded + 1 })
              .eq('uuid', photo.uuid)
          );

          // Wait for all the updates to resolve
          await Promise.all(updatePromises);
        }

      } catch (error) {
        console.error('Error updating photo days:', error);
      }
    }

    // Start the interval only after initial photos are loaded
    fetchAllPhotosLater().then(() => {
      intervalId = setInterval(updatePhotoDays, 10);
    });

    // Cleanup the interval when the component is unmounted
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
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
        <h1 className={styles.title}>Theta Tau x BeReal</h1>
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