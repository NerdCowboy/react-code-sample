import { useState, useEffect } from 'react'
import Helmet from 'react-helmet'
import {
  Toolbar,
  AppBar,
  CircularProgress,
  GridList,
  GridListTile,
  Box,
  Modal,
  Button,
  useMediaQuery,
} from '@material-ui/core';
import { Close, Error } from '@material-ui/icons'
import { useTheme } from '@material-ui/core/styles';
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import styles from './App.module.scss'


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContents />
    </QueryClientProvider>
  );
}

function AppContents() {
  const [modalImg, setModalImg] = useState()
  const [gridCols, setGridCols] = useState(1)

  const theme = useTheme();
  const isSmallUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isMediumUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeUp = useMediaQuery(theme.breakpoints.up('lg'));

  // Adjust number of columns
  useEffect(() => {
    if(isSmallUp) setGridCols(2)
    if(isMediumUp) setGridCols(3)
    if(isLargeUp) setGridCols(4)
  }, [isSmallUp, isMediumUp, isLargeUp])


  // This API unfortunately only gives the option of loading full-sized images
  // If I had more time, I would grab the ID and run separate queries
  // to get smaller dimensions to ensure faster loading
  const { isLoading, error, data } = useQuery("repoData", () =>
    fetch(
      `https://picsum.photos/v2/list`
    ).then((res) => res.json())
  );

  const handleOpen = (img) => {
    setModalImg(img)
  }

  const handleClose = () => {
    setModalImg()
  }

  return (
    <div className={styles.appWrapper}>
      <Helmet>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Helmet>
      <AppBar position="static">
        <Toolbar>
          Picsum Pics
        </Toolbar>
      </AppBar>
      <main className={styles.main}>
        {isLoading && (
          <div className={styles.statusContainer}>
            <CircularProgress />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className={styles.statusContainer}>
            <Box textAlign="center">
              <Error color="error" style={{ fontSize: 60 }}/>
              <h2>We're having trouble loading these images</h2>
              <p>Please try again or check back later.</p>
            </Box>
          </div>
        )}

        {/* Images */}
        {data && (
          <GridList cellHeight={300} cols={gridCols}>
          {data.map(_img => (
            <GridListTile key={_img.id} cols={_img.cols || 1}>
              <img
                role="button"
                className={styles.gridImg}
                onClick={() => handleOpen(_img.download_url)}
                src={_img.download_url}
                alt="" // should have a description, but API doesn't provide anything
                aria-label="Open full-size image"
                loading="lazy"
              />
            </GridListTile>
          ))}
          </GridList>
        )}

        {/* Modal image */}
        <Modal
          className={styles.modalContainer}
          open={!!modalImg}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className={styles.modalImgWrapper}>
            <Button onClick={handleClose} className={styles.modalCloseButton} >
              <Close color="action" className={styles.modalCloseIcon} />
              Close
            </Button>
            <img
              className={styles.modalImg}
              src={modalImg}
              alt="" // should have a description, but API doesn't provide anything
            />
          </div>
        </Modal>

      </main>
    </div>
  );
}

export default App;
