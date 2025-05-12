import "./App.css";
import { Navbar } from "./components/layout/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";

import { Toaster } from "react-hot-toast";
import Result from "./pages/Result";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<Result />} />
        </Routes>

        <Footer />
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 2000,
          }}
        />
      </BrowserRouter>
    </>
  );
}

export default App;
