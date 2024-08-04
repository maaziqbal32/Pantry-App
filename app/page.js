"use client";

import { Box, Stack, Typography, Button, Modal, TextField } from "@mui/material";
import { collection, getDocs, query, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { firestore } from '@/firebase';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
  }
`;

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#fff',
  borderRadius: '8px',
  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
  p: 4,
  animation: `${fadeIn} 0.3s ease-in-out`,
};

const buttonStyle = {
  borderRadius: '20px',
  textTransform: 'none',
  fontWeight: 'bold',
  transition: 'background-color 0.3s, transform 0.2s, box-shadow 0.3s',
  '&:hover': {
    backgroundColor: '#005a9c',
    transform: 'scale(1.05)',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)',
  },
};

const itemBoxStyle = {
  borderRadius: '12px',
  padding: '16px',
  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #ccc',
  animation: `${slideIn} 0.4s ease-out`,
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
};

const quantityStyle = {
  minWidth: '100px', // Fixed width for quantity section
  textAlign: 'center',
  fontWeight: 'bold',
  color: '#333',
};

const scrollStyle = {
  overflowY: 'auto',
  maxHeight: '300px',
};

const pageStyle = {
  background: '#eaeaea', // Light gray background for a professional look
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  fontFamily: '"Roboto", sans-serif',
};

const containerStyle = {
  width: '800px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
  padding: '20px',
};

const headerStyle = {
  borderRadius: '8px',
  padding: '16px',
  backgroundColor: '#004d40', // Dark teal background for header
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  borderBottom: '4px solid #003d34', // Slightly darker border color
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry = async () => {
    try {
      const snapshot = query(collection(firestore, 'pantry'));
      const docs = await getDocs(snapshot);
      const pantryList = docs.docs.map(doc => ({
        name: doc.id,
        count: doc.data().count || 0,
      }));
      console.log('Retrieved pantry items:', pantryList);
      setPantry(pantryList);
    } catch (error) {
      console.error("Error fetching pantry items: ", error);
    }
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'pantry'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { count } = docSnap.data();
        await setDoc(docRef, { count: count + 1 });
      } else {
        await setDoc(docRef, { count: 1 });
      }

      await updatePantry();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'pantry'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { count } = docSnap.data();
        if (count > 1) {
          await setDoc(docRef, { count: count - 1 });
        } else {
          await deleteDoc(docRef);
        }
        await updatePantry();
      } else {
        console.error(`Document with ID ${item} does not exist`);
      }
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  };

  return (
    <Box sx={pageStyle}>
      <Box sx={containerStyle}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
              Add Item
            </Typography>
            <Stack direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                sx={buttonStyle}
                onClick={() => {
                  if (itemName.trim()) {
                    addItem(itemName.trim());
                    setItemName('');
                    handleClose();
                  }
                }}
              >
                <AddCircleOutlineIcon sx={{ mr: 1 }} />
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button
          variant="contained"
          color="primary"
          sx={{ ...buttonStyle, marginBottom: '16px' }}
          onClick={handleOpen}
        >
          <AddCircleOutlineIcon sx={{ mr: 1 }} />
          Add Item
        </Button>
        <Box border={'1px solid #ddd'} borderRadius={'8px'} overflow={'hidden'}>
          <Box
            width="100%"
            height="100px"
            sx={headerStyle}
          >
            <Typography
              variant={'h2'}
              color={'#fff'}
              textAlign={'center'}
              sx={{ fontWeight: 'bold' }}
            >
              Pantry Items
            </Typography>
          </Box>
          <Stack width="100%" spacing={2} sx={scrollStyle}>
            {pantry.map((item) => (
              <Box
                key={item.name}
                sx={itemBoxStyle}
              >
                <Typography
                  variant={'h3'}
                  color={'#333'}
                  sx={{ fontWeight: 'bold', flexGrow: 1 }}
                >
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </Typography>
                <Box sx={quantityStyle}>
                  Quantity: {item.count.toString()}
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => removeItem(item.name)}
                  sx={buttonStyle}
                >
                  <RemoveCircleOutlineIcon sx={{ mr: 1 }} />
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
