import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

export async function getServerSideProps() {
  // remember to change address when hosted on some server
  let res = await fetch("http://localhost:3000/api/files", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let serversideProps = await res.json();
  console.log(serversideProps);

  return {
    props: { initialData: serversideProps.data },
  };
};

export default function Home({ initialData }) {
  let [loading, setLoading] = useState(false);
  let [data, setData] = useState(initialData);
  
  const [selectAll, setSelectAll] = useState(false);
  const [checkedState, setCheckedState] = useState(new Array(data.length).fill(false));

  async function onSearch(event) {

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({ 
          searchWords: event.target.value
      }),
    });
    if(response.ok){
      const res = await response.json();
      setData(res.data);
      console.log(res);
    }
    } catch (error) {
      // handle at some point
    }
  };

  async function onUpload(event) {
    event.preventDefault();
    try {
      const tagsResponse = await generateTags(event);
      
        console.log("CLIENT - GENERATED TAGS:");
        console.log(tagsResponse);   

        const saveFileResponse = await saveFile(event, tagsResponse.sort());
        console.log("CLIENT - NEW FILE ID:");
        console.log(saveFileResponse); 
        const response = await fetch("/api/files", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const newData = await response.json();
        setData(newData.data);
    } catch (error) {
      console.error("CLIENT - An error occurred:", error);
  }
  };

  async function saveFile(event, tags){
    const file = event.target.files[0];
    setLoading(true);

    let reader = new FileReader();

    let fileContent = await new Promise(( resolve, reject) => {
      reader.onload = event => resolve(event.target.result);
      reader.onerror = error => reject(error);
      reader.readAsText(file);
    });

    try {
      const response = await fetch("/api/files", {
        method: "POST",
        body: JSON.stringify({ 
          title: file.name,
          content: fileContent,
          type: file.type,
          size: file.size,
          tags: tags
         }),
      });
      if (response.ok) {
        setLoading(false);
        const res = await response.json();
        return res.insertedId;
      }else {
        setLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // handle at some point
    }
  };

  async function generateTags(event){
    const textFile = event.target.files[0];
    setLoading(true);

    let reader = new FileReader();
    let fileContent = await new Promise(( resolve, reject) => {
      reader.onload = event => resolve(event.target.result);
      reader.onerror = error => reject(error);
      reader.readAsText(textFile);
    });
    try {
      const response = await fetch("/api/generateTags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          content: fileContent,
          title: textFile.name
          }),
    });
    if (response.ok) {
      const res = await response.json();
      setLoading(false);
      console.log("GENERATE TAGS RESULT:");
      console.log(res.result);
      return res.result;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      setLoading(false);
    }
  };

  function handleSelectAllClick() {
      setSelectAll(!selectAll);
      setCheckedState(new Array(data.length).fill(!selectAll));
  }

  function handleSingleCheckboxChange(index, event) {
    const updatedCheckedState = checkedState.map((item, idx) =>
        idx === index ? !item : item
    );

    setCheckedState(updatedCheckedState);

    // If every checkbox is checked, also set the selectAll state to true, otherwise false
    setSelectAll(updatedCheckedState.every(item => item));
  };


  async function onDelete(event) {

  };

  useEffect(() => {
    setCheckedState(new Array(data.length).fill(false));
  }, [data]);

  return (
    <div className={styles.main}>
      <Head>
          <title>File Explorer</title>
      </Head>
          <div className={styles.topBar}>
              <input type="text" className={styles.searchBar} onChange={onSearch} placeholder="Search..."/>
              <label className={styles.uploadButton}>
                <img src="/upload.png"/>
                <input type="file"  className={styles.uploadInput} onChange={onUpload}/>
              </label>
              <img src="/delete.png" className={styles.deleteButton} onClick={onDelete} />
          </div>
          <div className={styles.fileExplorer}>
            <table>
                <thead>
                    <tr>
                        <th><input type="checkbox" checked={selectAll} onChange={handleSelectAllClick}/></th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((file, index) => (
                        <tr key={index}>
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={checkedState[index]} 
                                    onChange={(event) => handleSingleCheckboxChange(index, event)}
                                />
                            </td>
                            <td><a href={file.url} target="_blank" rel="noopener noreferrer">{file.title}</a></td>
                            <td className={styles.fileTypeColumn}>{file.type}</td>
                            <td className={styles.tagContainer}>
                                {file.tags.map((tag, tagIndex) => (
                                    <span key={tagIndex} className={styles.tagSpan}>{tag} </span>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}