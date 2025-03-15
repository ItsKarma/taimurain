import { SWRConfig } from "swr";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const localStorageProvider = () => {
  const isBrowser = typeof window !== "undefined";
  let map = new Map();

  if (isBrowser) {
    // When initializing, we restore the data from localStorage into a map.
    const storedData = window.localStorage.getItem("swr-cache");
    if (storedData) {
      map = new Map(JSON.parse(storedData));
    }

    console.log("map", map);

    // Before unloading the app, we write back all the data to localStorage.
    window.addEventListener("beforeunload", () => {
      const appCache = JSON.stringify(Array.from(map.entries()));
      localStorage.setItem("swr-cache", appCache);
    });
  }

  return map;
};

const theme = createTheme({
  palette: {
    background: {
      default: "#071e34", // Set your desired background color
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SWRConfig value={{ provider: localStorageProvider }}>
        <Component {...pageProps} />
      </SWRConfig>
    </ThemeProvider>
  );
}
