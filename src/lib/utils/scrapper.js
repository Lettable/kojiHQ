// const MetaFetcher = require("meta-fetcher");

// async function fetchAndAnalyze(url) {
//   try {
//     const metadata = await MetaFetcher(url);
//     return metadata
//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// }

// export default fetchAndAnalyze;


import MetaFetcher from "meta-fetcher";

async function fetchAndAnalyze(url) {
  try {
    const metadata = await MetaFetcher(url);
    console.log("Fetched Metadata:", metadata);
    return metadata;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

export default fetchAndAnalyze;