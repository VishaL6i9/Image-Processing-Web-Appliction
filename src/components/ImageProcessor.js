import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Typography,
  Box
} from '@mui/material';

const API_BASE_URL = 'http://localhost:8080/api/image';

function ImageProcessor() {
  const [file, setFile] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState('');
  const [flipDirection, setFlipDirection] = useState('horizontal');
  const [rotateDegrees, setRotateDegrees] = useState(90);
  const [resizeWidth, setResizeWidth] = useState(500);
  const [resizeHeight, setResizeHeight] = useState(500);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    console.log('File selected:', event.target.files[0].name);
  };

  const uploadImage = async () => {
    if (!file) {
      setErrorMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Uploading image...');
      const response = await axios.post(`${API_BASE_URL}/upload`, formData);
      console.log('Upload response:', response.data);
      setProcessedImageUrl(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error uploading image:', error.response ? error.response.data : error.message);
      setErrorMessage('Error uploading image. Please try again.');
    }
  };

  const processImage = async (endpoint, additionalParams = {}) => {
    if (!file) {
      setErrorMessage('Please upload an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    for (const [key, value] of Object.entries(additionalParams)) {
      formData.append(key, value);
    }

    try {
      console.log(`Processing image with endpoint: ${endpoint}`);
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData);
      console.log('Process response:', response.data);
      setProcessedImageUrl(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error processing image:', error.response ? error.response.data : error.message);
      setErrorMessage(`Error processing image with ${endpoint}. Please try again.`);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '800px', margin: '20px auto' }}>
      <Typography variant="h4" gutterBottom>
        Image Processor
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={uploadImage}>
            Upload Image
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={() => processImage('/invert')}>
            Invert
          </Button>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Flip Direction</InputLabel>
            <Select
              value={flipDirection}
              onChange={(e) => setFlipDirection(e.target.value)}
            >
              <MenuItem value="horizontal">Horizontal</MenuItem>
              <MenuItem value="vertical">Vertical</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={() => processImage('/flip', { direction: flipDirection })}>
            Flip
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="number"
            label="Rotation Degrees"
            value={rotateDegrees}
            onChange={(e) => setRotateDegrees(e.target.value)}
          />
          <Button variant="contained" onClick={() => processImage(`/rotate/${rotateDegrees}`)}>
            Rotate
          </Button>
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="number"
            label="Resize Width"
            value={resizeWidth}
            onChange={(e) => setResizeWidth(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="number"
            label="Resize Height"
            value={resizeHeight}
            onChange={(e) => setResizeHeight(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={() => processImage('/resize', { width: resizeWidth, height: resizeHeight })}>
            Resize
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={() => processImage('/grayscale')}>
            Grayscale
          </Button>
        </Grid>
        {errorMessage && (
          <Grid item xs={12}>
            <Typography color="error">{errorMessage}</Typography>
          </Grid>
        )}
        {processedImageUrl && (
          <Grid item xs={12}>
            <Box mt={2}>
              <img src={processedImageUrl} alt="Processed" style={{ maxWidth: '100%' }} />
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}

export default ImageProcessor;