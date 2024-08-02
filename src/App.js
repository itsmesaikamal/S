import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SLogin from './components/SLogin';
import SHome from './components/SHome';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<SLogin />} />
          <Route path="/home/*" element={<SHome />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
