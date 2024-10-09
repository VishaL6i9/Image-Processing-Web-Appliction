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
  createTheme,
  ThemeProvider,
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

// Create the custom theme
const theme = createTheme({
  palette: {
    primary: { main: '#3f51b5' },
    secondary: { main: '#f50057' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: { fontWeight: 700, color: '#3f51b5' },
    h6: { fontWeight: 600, color: '#f50057' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        containedPrimary: {
          backgroundColor: '#3f51b5',
          '&:hover': {
            backgroundColor: '#303f9f',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default function ImageProcessor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedImgUrl, setProcessedImgUrl] = useState('');
  const [imgHistory, setImgHistory] = useState([]);
  const [flipDir, setFlipDir] = useState('horizontal');
  const [rotateAngle, setRotateAngle] = useState(90);
  const [resizeWidth, setResizeWidth] = useState(500);
  const [resizeHeight, setResizeHeight] = useState(500);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileSelection = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log('File selected:', event.target.files[0].name);
  };

  const uploadSelectedImage = async () => {
    if (!selectedFile) {
      setErrorMsg('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      console.log('Uploading image...');
      const response = await axios.post(`${API_BASE_URL}/upload`, formData);
      console.log('Upload response:', response.data);
      setProcessedImgUrl(response.data);
      setImgHistory([{ operation: 'Upload', imageUrl: response.data }]);
      setErrorMsg('');
    } catch (error) {
      console.error('Error uploading image:', error.response ? error.response.data : error.message);
      setErrorMsg('Error uploading image. Please try again.');
    }
  };

  const processSelectedImage = async (endpoint, operation, additionalParams = {}) => {
    if (!processedImgUrl) {
      setErrorMsg('Please upload an image first.');
      return;
    }

    const formData = new FormData();
    const filename = processedImgUrl.split('/').pop(); // Extract filename from URL
    formData.append('previousImage', filename);

    for (const [key, value] of Object.entries(additionalParams)) {
      formData.append(key, value);
    }

    try {
      console.log(`Processing image with endpoint: ${endpoint}`);
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData);
      console.log('Process response:', response.data);
      setProcessedImgUrl(response.data);

      let historyEntry = { operation, imageUrl: response.data };
      if (operation === 'Flip') historyEntry.details = `Direction: ${flipDir}`;
      if (operation === 'Rotate') historyEntry.details = `Angle: ${rotateAngle}°`;
      if (operation === 'Resize') historyEntry.details = `Width: ${resizeWidth}, Height: ${resizeHeight}`;

      setImgHistory([...imgHistory, historyEntry]);
      setErrorMsg('');
    } catch (error) {
      console.error('Error processing image:', error.response ? error.response.data : error.message);
      setErrorMsg(`Error processing image with ${operation}. Please try again.`);
    }
  };

  const revertToPreviousImage = (index) => {
    const newImgHistory = imgHistory.slice(0, index);
    setImgHistory(newImgHistory);
    setProcessedImgUrl(newImgHistory[newImgHistory.length - 1].imageUrl);
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={3} style={{ padding: '30px', maxWidth: '900px', margin: '20px auto', backgroundColor: theme.palette.background.default }}>
        <Typography variant="h4" gutterBottom style={{ color: theme.palette.primary.main, textAlign: 'center', marginBottom: '20px' }}>
          Image Processor
        </Typography>
        <Grid container spacing={3}>
          {/* File upload section */}
          <Grid item xs={12}>
            <Card style={{ padding: '20px', marginBottom: '20px', backgroundColor: theme.palette.background.paper }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <input
                      type="file"
                      onChange={handleFileSelection}
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
                    <Button variant="contained" color="primary" onClick={uploadSelectedImage} startIcon={<FileUploadIcon />} fullWidth>
                      Upload Image
                    </Button>
                  </Grid>
                </Grid>
                {selectedFile && <Typography variant="body2" style={{ marginTop: '10px', textAlign: 'center' }}>{selectedFile.name}</Typography>}
              </CardContent>
            </Card>
          </Grid>

          {/* Basic Operations */}
          <Grid item xs={12} sm={6}>
            <Card style={{ height: '100%', backgroundColor: theme.palette.background.paper }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Basic Operations</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Button variant="outlined" onClick={() => processSelectedImage('/invert', 'Invert')} fullWidth startIcon={<InvertColorsIcon />}>
                      Invert Colors
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" onClick={() => processSelectedImage('/grayscale', 'Grayscale')} fullWidth startIcon={<FilterBAndWIcon />}>
                      Convert to Grayscale
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Flip Image */}
          <Grid item xs={12} sm={6}>
            <Card style={{ height: '100%', backgroundColor: theme.palette.background.paper }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Flip Image</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Flip Direction</InputLabel>
                      <Select
                        value={flipDir}
                        onChange={(e) => setFlipDir(e.target.value)}
                      >
                        <MenuItem value="horizontal">Horizontal</MenuItem>
                        <MenuItem value="vertical">Vertical</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" onClick={() => processSelectedImage('/flip', 'Flip', { direction: flipDir })} fullWidth startIcon={<FlipIcon />}>
                      Flip Image
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Rotate Image */}
          <Grid item xs={12} sm={6}>
            <Card style={{ height: '100%', backgroundColor: theme.palette.background.paper }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Rotate Image</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      type="number"
                      label="Rotation Degrees"
                      value={rotateAngle}
                      onChange={(e) => setRotateAngle(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" onClick={() => processSelectedImage(`/rotate/${rotateAngle}`, 'Rotate')} fullWidth startIcon={<RotateRightIcon />}>
                      Rotate Image
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Resize Image */}
          <Grid item xs={12} sm={6}>
            <Card style={{ height: '100%', backgroundColor: theme.palette.background.paper }}>
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
                    <Button variant="outlined" onClick={() => processSelectedImage('/resize', 'Resize', { width: resizeWidth, height: resizeHeight })} fullWidth startIcon={<CropIcon />}>
                      Resize Image
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Processed Image Display */}
          {processedImgUrl && (
            <Grid item xs={12}>
              <Card style={{ marginTop: '20px', backgroundColor: theme.palette.background.paper }}>
                <CardContent>
                  <img src={processedImgUrl} alt="Processed" style={{ maxWidth: '100%', borderRadius: '4px' }} />
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    href={processedImgUrl}
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
            <Card style={{ marginTop: '20px', backgroundColor: theme.palette.background.paper }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Image Processing History
                </Typography>
                <List>
                  {imgHistory.map((historyItem, index) => (
                    <React.Fragment key={index}>
                      <ListItem button onClick={() => revertToPreviousImage(index)} selected={index === imgHistory.length - 1}>
                        <ListItemText
                          primary={`Step ${index + 1}: ${historyItem.operation}`}
                          secondary={historyItem.details}
                        />
                        <ListItemIcon>
                          <IconButton edge="end" aria-label="revert" onClick={() => revertToPreviousImage(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemIcon>
                      </ListItem>
                      {index < imgHistory.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Snackbar open={!!errorMsg} autoHideDuration={6000} onClose={() => setErrorMsg('')}>
          <Alert onClose={() => setErrorMsg('')} severity="error" sx={{ width: '100%' }}>
            {errorMsg}
          </Alert>
        </Snackbar>
      </Paper>
    </ThemeProvider>
  );
}