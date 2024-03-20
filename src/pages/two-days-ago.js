import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import photo from '../../public/hari.jpeg'; // Verify this path is correct.
import styles from '../../src/styles/index.module.css';
import Link from 'next/link';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Two Days Ago');
  const tabRoutes = {'Today': "/", 'Yesterday': '/yesterday', 'Two days ago': '/two-days-ago', 'Three days ago': '/three-days-ago', 'Four days ago': '/four-days-ago', 'Five days ago': '/five-days-ago', 'Six days ago': '/six-days-ago'};
  const names = ['Hari', 'Kate', 'Cate' , 'Eddie' , 'Esben' , 'Isaac', 'Ella', 'George', 'Diego']; //need to figure out how to populate these arrays with data from supabase
  const dates = ['Date 1','Date 2','Date 3','Date 4','Date 5','Date 6','Date 7','Date 8','Date 9']; 
  //we could fill an array with all of the images for a particular date, and then decide which array to use based on the current useState
  useEffect(() => {
    // Your data fetching logic here.
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