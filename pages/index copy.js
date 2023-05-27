import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [imageInput, setImageInput] = useState("");
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();
  
  const handleImageUpload = (event) => {
    setImageInput(event.target.files[0]);
  };

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className={styles.body}>
      <Head>
        <title>Image Filters</title>
        <link rel="icon" href="/dog.png" />
      </Head>
        <main className={styles.main}>
          <img src="/dog.png" className={styles.icon} />
          <h3>Edit an Image</h3>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="animal"
              placeholder="Enter an animal"
              value={animalInput}
              onChange={(e) => setAnimalInput(e.target.value)}
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => handleImageUpload(e)} // New image upload handler
            />
            <input type="submit" value="Skinny" />
          </form>
          <div className={styles.result}>{result}</div>
        </main>
    </div>
  );
}
