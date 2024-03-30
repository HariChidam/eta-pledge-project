import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import photo from '../../public/isaac.jpeg'; // Verify this path is correct.
import styles from '../../src/styles/index.module.css';
import Link from 'next/link';
import supabase from '../../supabase.js';
import { v4 as uuidv4 } from 'uuid';



export default function Home() {
 
  

  const handleFileSelection = (event) => {
    const fileName = event.target.files[0] ? event.target.files[0].name : "No file chosen";
    document.getElementById('file-chosen').textContent = fileName;
  };
  
  const [activeTab, setActiveTab] = useState('Today');

  const tabRoutes = {'Today': "/", 'Yesterday': '/yesterday', 'Two days ago': '/two-days-ago', 'Later': '/later', 'Upload': '/upload'};
  const names = ['Hari', 'Kate', 'Cate' , 'Eddie' , 'Esben' , 'Isaac', 'Ella', 'George', 'Diego']; //need to figure out how to populate these arrays with data from supabase
  const dates = ['Date 1','Date 2','Date 3','Date 4','Date 5','Date 6','Date 7','Date 8','Date 9']; 
  //we could fill an array with all of the images for a particular date, and then decide which array to use based on the current useState

  const [image, setImage] = useState(null); //this will be an array of the images for the current date

  const uploadPicture = async (file, date) => {
    const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;
    const filePath = `path/to/store/${fileName}`;
  
    const { error: uploadError } = await supabase.storage.from('your-bucket').upload(filePath, file);
  
    if (uploadError) {
      throw uploadError;
    }
  
    const { publicURL, error: urlError } = supabase.storage.from('your-bucket').getPublicUrl(filePath);
  
    if (urlError) {
      throw urlError;
    }
  
    const { data, error } = await supabase.from('your-table').insert([{ name: fileName, url: publicURL, date: date }]);
  
    if (error) {
      throw error;
    }
  
    // Optionally update your state here to show the new image/date in your UI
  };
  

    useEffect(() => {

      // first go to table at get all uuid = some number of days
      // thend downlaod those uuid from the storage
      // then display them in the grid

      // function handleDownload(){
      //   const { data, error } = await supabase.from('photos').download()

      //   if (error) {
      //     throw error;
      //   }
  
      //   if (data) {
      //     console.log()
      //   }

      // }

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
        <div className={styles.gridContainer}>
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className={styles.relative}>
              <div className={`${styles.overflowHidden} ${styles.group}`}>
                <Image
                  src={photo}
                  alt={`Placeholder ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className={`${styles.imageOverlay} ${styles.group}`}>
                <span className={styles.imageText}>
                  {names[index]}<br />{dates[index]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
  }