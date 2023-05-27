import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [uploadedFile] = useState(null);
  let loading = false;

  async function setLoading(bool) {
    loading = bool;
  }
  
  async function onLoad() {
    let res = await fetch("/api/files", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let allFiles = await res.json();
    console.log(allFiles);

    return {
      props: { allFiles },
    };
  };

  async function onSearch(event) {

  };

  async function onUpload(event) {
    event.preventDefault();
    //save base file to database if new
    // console.log(event.target.files[0]);
    console.log(event.target.value);

    saveFile(event);

    //if audio file convert to temporary text file and save text file with reference to original audio

    // extract tags from text file

    // create new tags if any with new tag IDs

    // create instances of file to tag references
  };

  async function saveFile(event){
    const file = event.target.files[0];
    setLoading(true);
    try {
      const response = await fetch("/api/files", {
        method: "POST",
        body: JSON.stringify({ 
          title: file.name,
          content: file,
          type: file.type,
          size: file.size
         }),
      });
      setLoading(false);
    } catch (error) {
      // handle at some point
    }
    
  }

  return (
    <div className={styles.main}>
      <Head>
          <title>File Explorer</title>
      </Head>
      <body onLoad={onLoad}>
          <div className={styles.topBar}>
              <input type="text" className={styles.searchBar} onChange={onSearch} placeholder="Search..."/>
              <label className={styles.uploadButton}>
                <img src="/upload.png"/>
                <input type="file"  className={styles.uploadInput} onChange={onUpload}/>
              </label>
          </div>
          <div className={styles.fileExplorer}>
              <div className={styles.fileIcon}>
                  <img src="file-icon.png"/>
                  <p>File1.txt</p>
              </div>
              <div className={styles.fileIcon}>
                  <img src="file-icon.png"/>
                  <p>File2.txt</p>
              </div>
          </div>
      </body>
    </div>
  );
}
