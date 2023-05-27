import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

export async function getServerSideProps() {
  let res = await fetch("http://localhost:3000/api/files", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let serversideProps = await res.json();
  console.log(serversideProps);

  return {
    props: { data: serversideProps.data },
  };
};

export default function Home({ data }) {
  let [loading, setLoading] = useState(false);
  
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
  };

  useEffect(() => {
    //make api calls and update props section
  }, []);

  return (
    <div className={styles.main}>
      <Head>
          <title>File Explorer</title>
      </Head>
      <body>
          <div className={styles.topBar}>
              <input type="text" className={styles.searchBar} onChange={onSearch} placeholder="Search..."/>
              <label className={styles.uploadButton}>
                <img src="/upload.png"/>
                <input type="file"  className={styles.uploadInput} onChange={onUpload}/>
              </label>
          </div>
          <div className={styles.fileExplorer}>
            {data.map((file, index) => (
              <div key={index}>
                <h2>{file.title}</h2>
                <h3>{file.type}</h3>
                <div className={styles.fileIcon}>
                  <img src="file-icon.png"/>
              </div>
              </div>
            ))};
          </div>
      </body>
    </div>
  );
}