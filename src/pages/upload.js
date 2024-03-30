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

    useEffect(() => {
        const fetchImages = async () => {
            const { data, error } = await supabase.from('your-table').select('*');
            if (error) {
                console.error('Error fetching images:', error);
            } else {
                setImages(data);
            }
        };

        fetchImages();
    }, []);

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
