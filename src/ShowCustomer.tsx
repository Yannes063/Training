import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import TextField from "@mui/material/TextField";
import {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import type{GridColDef, GridRenderCellParams} from '@mui/x-data-grid';

type Customer = {
  id: number;
  firstname: string;
  lastname: string;
  streetaddress: string;
  postcode: string;
  city: string;
  email: string;
  phone: string;
};

function ShowCustomer() {

    const [loading, setLoading] = useState(false)
    const [records, setRecords] = useState<any[]>([]);

    const [searchText, setSearchText] = useState('');
    const [filteredRecords, setFilteredRecords] = useState<any[]>([]);

    const [newRecord, setNewRecord] = useState ({
      firstname: '',
      lastname: '',
      streetaddress: '',
      postcode: '',
      city: '',
      email: '',
      phone: '', 
    })
    const [openAdd, setOpenAdd] = useState(false);

    const handleAddOpen = () => setOpenAdd(true);
    const handleAddClose = () => setOpenAdd(false);

    const [Edit, setEdit] = useState(false);
    const [editCustomer, setEditCustomer] = useState<any>({});



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

const saveCustomer = () => {
  fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers', {
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

const handleEditOpen = (customer: any) => {
  setEditCustomer(customer);
  setEdit(true);
};

const handleEditClose = () => {
  setEdit(false);
};

const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setEditCustomer({ ...editCustomer, [e.target.name]: e.target.value });
};


const updateCustomer = () => {
  const url = `https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers/${editCustomer.id}`;
  
  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editCustomer)
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
  setLoading(true)
  fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers')
    .then(response => {
      if (!response.ok) {
        throw new Error("Error in fetch: " + response.statusText);
      }
      return response.json();
    })
    .then(responseData => {
      
      const customers = responseData._embedded.customers.map((customer: any) => {
       
        const href = customer._links.self.href;
        const id = Number(href.substring(href.lastIndexOf('/') + 1));
        return {
          ...customer,
          id: id,   
      }});
      setRecords(customers);
      setFilteredRecords(customers);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
}, []);

   const columns: GridColDef[] = [
        {field:'firstname', headerName: 'FirstName', width: 200},
        {field:'lastname', headerName: 'LastName', width: 150},
        {field:'streetaddress', headerName: 'StreetAddress', width: 200},
        {field:'postcode', headerName: 'PostCode', width: 200},
        {field:'city', headerName: 'City', width: 200},
        {field:'email', headerName: 'Email', width: 200},
        {field:'phone', headerName: 'Phone', width: 200},
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

    const handleSearch = () => {
  const keyword = searchText.trim().toLowerCase();

  if (!keyword) {
    setFilteredRecords(records);
    return;
  }

  const result = records.filter((row) =>
    row.firstname.toLowerCase().includes(keyword) ||
    row.lastname.toLowerCase().includes(keyword)
  );

  setFilteredRecords(result);
};



  return (
    <Box sx={{ flexGrow: 1 }}>
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

</Box>

{/* Dialog */}
<Dialog open={openAdd} onClose={handleAddClose}>
  <DialogTitle>Add New Customer</DialogTitle>
  <DialogContent>
    <TextField margin="dense" name="firstname" label="First name" fullWidth value={newRecord.firstname} onChange={handleAddChange} />
    <TextField margin="dense" name="lastname" label="Last name" fullWidth value={newRecord.lastname} onChange={handleAddChange} />
    <TextField margin="dense" name="streetaddress" label="Street address" fullWidth value={newRecord.streetaddress} onChange={handleAddChange} />
    <TextField margin="dense" name="postcode" label="Postcode" fullWidth value={newRecord.postcode} onChange={handleAddChange} />
    <TextField margin="dense" name="city" label="City" fullWidth value={newRecord.city} onChange={handleAddChange} />
    <TextField margin="dense" name="email" label="Email" fullWidth value={newRecord.email} onChange={handleAddChange} />
    <TextField margin="dense" name="phone" label="Phone" fullWidth value={newRecord.phone} onChange={handleAddChange} />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleAddClose}>Cancel</Button>
    <Button onClick={saveCustomer} variant="contained">Save</Button>
  </DialogActions>
</Dialog>

{/* Edit Dialog */}
<Dialog open={Edit} onClose={handleEditClose}>
  <DialogTitle>Edit Customer</DialogTitle>
  <DialogContent>
    <TextField margin="dense" name="firstname" label="First name" fullWidth value={editCustomer.firstname || ''} onChange={handleEditChange} />
    <TextField margin="dense" name="lastname" label="Last name" fullWidth value={editCustomer.lastname || ''} onChange={handleEditChange} />
    <TextField margin="dense" name="streetaddress" label="Street address" fullWidth value={editCustomer.streetaddress || ''} onChange={handleEditChange} />
    <TextField margin="dense" name="postcode" label="Postcode" fullWidth value={editCustomer.postcode || ''} onChange={handleEditChange} />
    <TextField margin="dense" name="city" label="City" fullWidth value={editCustomer.city || ''} onChange={handleEditChange} />
    <TextField margin="dense" name="email" label="Email" fullWidth value={editCustomer.email || ''} onChange={handleEditChange} />
    <TextField margin="dense" name="phone" label="Phone" fullWidth value={editCustomer.phone || ''} onChange={handleEditChange} />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleEditClose}>Cancel</Button>
    <Button onClick={updateCustomer} variant="contained">Save</Button>
  </DialogActions>
</Dialog>

        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
      <TextField
        label="Enter First Name of Last Name"
        variant="outlined"
        size="small"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch();  
        }}
        sx={{ width: 300 }}
      />
      <Button 
        variant="contained" 
        onClick={handleSearch}
      >
        Search
      </Button>
      <Button 
        variant="outlined" 
        onClick={() => {
          setSearchText('');
          setFilteredRecords(records); 
        }}
      >
        Clear
      </Button>
       <Button variant="contained" onClick={handleAddOpen}>
       Add Customer
      </Button>

    
    </Box>

      <div style = {{width: '100%', height: 700, margin:'auto'}}>
    <DataGrid 
        columns = {columns} 
        rows = {filteredRecords} 
        getRowId = {(row=>row.id)}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
      toolbar: {
        showQuickFilter: true,        
        quickFilterProps: { debounceMs: 300 },
      },
    }}
    disableColumnFilter={false}       
    disableDensitySelector            
    disableColumnSelector
        />
</div>
    </Box>
  );
}

export default ShowCustomer