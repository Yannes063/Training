import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import TextField from "@mui/material/TextField";
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {useEffect, useState} from 'react';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import type{GridColDef, GridRenderCellParams} from '@mui/x-data-grid';

type training = {
  id: number;
  date: string;
  duration: string
  activity: string;
};

function ShowTraining() {

    const [loading, setLoading] = useState(false)
    const [records, setRecords] = useState<any[]>([]);

    const [newRecord, setNewRecord] = useState ({
      date: '',
      duration: '',
      activity: ''
    })
    const [openAdd, setOpenAdd] = useState(false);

    const handleAddOpen = () => setOpenAdd(true);
    const handleAddClose = () => {
        setOpenAdd(false);
        setNewRecord({ date: '', duration: '', activity: '' });
        };

    const [Edit, setEdit] = useState(false);
    const [editTraining, setEditTraining] = useState<any>({});


    const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

   const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
};

const saveTraining = () => {
  fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRecord)
  })
    .then(res => {
      if (res.ok) {
  
        window.location.reload(); 
      }
    })
    .catch(err => console.error(err));
  
  handleAddClose();
};

const handleEditOpen = (training: any) => {
  setEditTraining(training);
  setEdit(true);
};

const handleEditClose = () => {
  setEdit(false);
};

const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setEditTraining({ ...editTraining, [e.target.name]: e.target.value });
};


const updateTraining = () => {
  const url = `https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings/${editTraining.id}`;
  
  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editTraining)
  })
    .then(res => {
      if (res.ok) {
        
        window.location.reload();
      }
    })
    .catch(err => console.error(err));

  handleEditClose();
};


   useEffect(() => {
  setLoading(true);
  fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings')
    .then(response => {
      if (!response.ok) {
        throw new Error("Error in fetch: " + response.statusText);
      }
      return response.json();
    })
    .then(responseData => {
      
      const training = responseData._embedded.trainings.map((training: any) => {
       
        const href = training._links.self.href;
        const id = Number(href.substring(href.lastIndexOf('/') + 1));
        return {
          ...training,
          id: id,   
      }});
      setRecords(training);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
}, []);

   const columns: GridColDef[] = [
        {field:'date', 
        headerName: 'Date', 
        width: 200 ,
        valueFormatter: (value) => {
            if(!value)
                return '';
            return dayjs(value).format('DD.MM.YYYY HH:mm');

        }},
        {field:'duration', headerName: 'Duration', width: 150},
        {field:'activity', headerName: 'Activity', width: 200},
         {
        field: 'actions',
        headerName: 'Actions',
        width: 180,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams) => (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button 
        size="small" 
        variant="outlined"
        onClick={() => handleEditOpen(params.row)}
      >
        Edit
      </Button>
      <Button 
        size="small" 
        color="error" 
        variant="outlined"
        onClick={() => handleDelete(params.row.id)}
      >
        Delete
      </Button>
    </Box>
  )
}


    ]

    const handleDelete = (id: string) => {

        if (window.confirm("Are you  sure to delete?")) {
            
            setRecords(records.filter((record) => record.id !== id));
        }

        
    }

   



  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar + Menu */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={() => { navigate('/'); handleClose(); }}>
              Customers
            </MenuItem>
            <MenuItem onClick={() => { navigate('/trainings'); handleClose(); }}>
              Trainings
            </MenuItem>
          </Menu>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Training Information
          </Typography>
        </Toolbar>
      </AppBar>

      
      <Box sx={{ p: 2 }}>
        <Button variant="contained" onClick={handleAddOpen}>
          Add Training
        </Button>
      </Box>


      <Dialog open={openAdd} onClose={handleAddClose}>
        <DialogTitle>Add New Training</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, mb: 1 }}>
      <DateTimePicker
        label="Date & Time"
        value={newRecord.date ? dayjs(newRecord.date) : null}
        onChange={(newValue: Dayjs | null) => {
          setNewRecord({
            ...newRecord,
            date: newValue ? newValue.toISOString() : ''
          });
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            margin: 'dense'
          }
        }}
      />
    </Box>
          <TextField
            margin="dense"
            name="duration"
            label="Duration"
            fullWidth
            value={newRecord.duration}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            name="activity"
            label="Activity"
            fullWidth
            value={newRecord.activity}
            onChange={handleAddChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button onClick={saveTraining} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={Edit} onClose={handleEditClose}>
        <DialogTitle>Edit Training</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="date"
            label="Date"
            fullWidth
            value={editTraining.date || ''}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="duration"
            label="Duration"
            fullWidth
            value={editTraining.duration || ''}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="activity"
            label="Activity"
            fullWidth
            value={editTraining.activity || ''}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={updateTraining} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* DataGrid */}
      <div style={{ width: '100%', height: 700, margin: 'auto' }}>
        <DataGrid
          columns={columns}
          rows={records}
          loading={loading}
          getRowId={(row) => row.id}
          slots={{ toolbar: GridToolbar }}
          disableColumnFilter={false}
          disableDensitySelector
          disableColumnSelector
        />
      </div>
    </Box>
    </LocalizationProvider>
  );
}

export default ShowTraining