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
  Link,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import FlipIcon from '@mui/icons-material/Flip';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import CropIcon from '@mui/icons-material/Crop';
import FilterBAndWIcon from '@mui/icons-material/FilterBAndW';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';

const API_BASE_URL = 'http://localhost:8080/api/image';

export default function ImageProcessor() {
  const [file, setFile] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState('');
  const [imageHistory, setImageHistory] = useState([]);
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
      setImageHistory([{ operation: 'Upload', imageUrl: response.data }]);
      setErrorMessage('');
    } catch (error) {
      console.error('Error uploading image:', error.response ? error.response.data : error.message);
      setErrorMessage('Error uploading image. Please try again.');
    }
  };

  const processImage = async (endpoint, operation, additionalParams = {}) => {
    if (!processedImageUrl) {
      setErrorMessage('Please upload an image first.');
      return;
    }

    const formData = new FormData();
    const filename = processedImageUrl.split('/').pop(); // Extract filename from URL
    formData.append('previousImage', filename);

    for (const [key, value] of Object.entries(additionalParams)) {
      formData.append(key, value);
    }

    try {
      console.log(`Processing image with endpoint: ${endpoint}`);
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData);
      console.log('Process response:', response.data);
      setProcessedImageUrl(response.data);

      let historyEntry = { operation, imageUrl: response.data };
      if (operation === 'Flip') historyEntry.details = `Direction: ${flipDirection}`;
      if (operation === 'Rotate') historyEntry.details = `Angle: ${rotateDegrees}°`;
      if (operation === 'Resize') historyEntry.details = `Width: ${resizeWidth}, Height: ${resizeHeight}`;

      setImageHistory([...imageHistory, historyEntry]);
      setErrorMessage('');
    } catch (error) {
      console.error('Error processing image:', error.response ? error.response.data : error.message);
      setErrorMessage(`Error processing image with ${operation}. Please try again.`);
    }
  };

  const revertImage = (index) => {
    const newImageHistory = imageHistory.slice(0, index);
    setImageHistory(newImageHistory);
    setProcessedImageUrl(newImageHistory[newImageHistory.length - 1].imageUrl);
  };

  return (
    <Paper elevation={3} style={{ padding: '30px', maxWidth: '900px', margin: '20px auto', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" gutterBottom style={{ color: '#333', textAlign: 'center', marginBottom: '20px' }}>
        Image Processor
      </Typography>
      <Grid container spacing={3}>
        {/* File upload section */}
        <Grid item xs={12}>
          <Card style={{ padding: '20px', marginBottom: '20px', backgroundColor: '#fff' }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                  />
                  <label htmlFor="raised-button-file">
                    <Button variant="contained" component="span" startIcon={<FileUploadIcon />} fullWidth>
                      Choose File
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button variant="contained" color="primary" onClick={uploadImage} startIcon={<FileUploadIcon />} fullWidth>
                    Upload Image
                  </Button>
                </Grid>
              </Grid>
              {file && <Typography variant="body2" style={{ marginTop: '10px', textAlign: 'center' }}>{file.name}</Typography>}
            </CardContent>
          </Card>
        </Grid>

        {/* Basic Operations */}
        <Grid item xs={12} sm={6}>
          <Card style={{ height: '100%', backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Basic Operations</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button variant="outlined" onClick={() => processImage('/invert', 'Invert')} fullWidth startIcon={<InvertColorsIcon />}>
                    Invert Colors
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" onClick={() => processImage('/grayscale', 'Grayscale')} fullWidth startIcon={<FilterBAndWIcon />}>
                    Convert to Grayscale
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Flip Image */}
        <Grid item xs={12} sm={6}>
          <Card style={{ height: '100%', backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Flip Image</Typography>
              <Grid container spacing={2}>
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
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" onClick={() => processImage('/flip', 'Flip', { direction: flipDirection })} fullWidth startIcon={<FlipIcon />}>
                    Flip Image
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Rotate Image */}
        <Grid item xs={12} sm={6}>
          <Card style={{ height: '100%', backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Rotate Image</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    type="number"
                    label="Rotation Degrees"
                    value={rotateDegrees}
                    onChange={(e) => setRotateDegrees(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" onClick={() => processImage(`/rotate/${rotateDegrees}`, 'Rotate')} fullWidth startIcon={<RotateRightIcon />}>
                    Rotate Image
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Resize Image */}
        <Grid item xs={12} sm={6}>
          <Card style={{ height: '100%', backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Resize Image</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    type="number"
                    label="Width"
                    value={resizeWidth}
                    onChange={(e) => setResizeWidth(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="number"
                    label="Height"
                    value={resizeHeight}
                    onChange={(e) => setResizeHeight(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" onClick={() => processImage('/resize', 'Resize', { width: resizeWidth, height: resizeHeight })} fullWidth startIcon={<CropIcon />}>
                    Resize Image
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Processed Image Display */}
        {processedImageUrl && (
          <Grid item xs={12}>
            <Card style={{ marginTop: '20px', backgroundColor: '#fff' }}>
              <CardContent>
                <img src={processedImageUrl} alt="Processed" style={{ maxWidth: '100%', borderRadius: '4px' }} />
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  href={processedImageUrl}
                  download="processed_image.png"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  fullWidth
                >
                  Download Processed Image
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )}

        {/* Image Processing History */}
        <Grid item xs={12}>
          <Card style={{ marginTop: '20px', backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Image Processing History
              </Typography>
              <List>
                {imageHistory.map((historyItem, index) => (
                  <React.Fragment key={index}>
                    <ListItem button onClick={() => revertImage(index)} selected={index === imageHistory.length - 1}>
                      <ListItemText
                        primary={`Step ${index + 1}: ${historyItem.operation}`}
                        secondary={historyItem.details}
                      />
                      <ListItemIcon>
                        <IconButton edge="end" aria-label="revert" onClick={() => revertImage(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemIcon>
                    </ListItem>
                    {index < imageHistory.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
        <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}