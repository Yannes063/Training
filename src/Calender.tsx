
import { useEffect, useState } from 'react';
import {Calendar,dayjsLocalizer,Views,} from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {Box,AppBar,Toolbar,Typography,IconButton,Menu,MenuItem,Button,ButtonGroup,TextField,Alert,CircularProgress,} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const localizer = dayjsLocalizer(dayjs);

type TrainingEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
};

const calendarViews = [
  Views.MONTH,
  Views.WEEK,
  Views.DAY,
  Views.AGENDA,
];

{/* layout to view calendar */}
function CalendarToolbar(props: any) {
  const { date, view, onNavigate, onView, label } = props;

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    if (!value) return;

    const [year, month, day] = value.split('-').map(Number);

    const selectedDate = new Date(year, month - 1, day);

    onNavigate('DATE', selectedDate);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap',
        mb: 2,
        width: '100%',
      }}
    >
      {/* Middle: Date and date picker */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="h6">{label}</Typography>

        <TextField
          type="date"
          size="small"
          value={dayjs(date).format('YYYY-MM-DD')}
          onChange={handleDateChange}
          sx={{ width: 160 }}
        />
      </Box>

      {/* Right: View buttons */}
      <ButtonGroup variant="outlined">
        {[
          { value: Views.MONTH, label: 'Month' },
          { value: Views.WEEK, label: 'Week' },
          { value: Views.DAY, label: 'Day' },
          { value: Views.AGENDA, label: 'Agenda' },
        ].map((item) => (
          <Button
            key={item.value}
            onClick={() => onView(item.value)}
            variant={
              view === item.value ? 'contained' : 'outlined'
            }
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
            }}
          >
            {item.label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
}

function CalendarView() {
  const navigate = useNavigate();

  const [events, setEvents] = useState<TrainingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.WEEK);


{/* on color follow where i press */}
  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

 
  useEffect(() => {
    let cancelled = false;

    {/*get training data */}
    const fetchTrainings = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings'
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load trainings (${response.status})`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid training data received');
        }

        const mapped: TrainingEvent[] = data.map((t: any) => {
          const start = new Date(t.date);

          if (isNaN(start.getTime())) {
            throw new Error('Invalid training date');
          }

          const end = dayjs(start)
            .add(Number(t.duration) || 0, 'minute')
            .toDate();

          const customerName = t.customer
            ? `${t.customer.firstname} ${t.customer.lastname}`
            : 'No customer';

          return {
            id: t.id,
            title: `${t.activity} / ${customerName}`,
            start,
            end,
          };
        });

        if (!cancelled) {
          setEvents(mapped);
        }
      } catch (err) {
        console.error('Calendar error:', err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load trainings'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTrainings();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleMenuClose = () => setAnchorEl(null);

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top navigation */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleNavigation('/')}>
              Customers
            </MenuItem>

            <MenuItem
              onClick={() => handleNavigation('/trainings')}
            >
              Trainings
            </MenuItem>

            <MenuItem
              onClick={() => handleNavigation('/calendar')}
            >
              Calendar
            </MenuItem>
          </Menu>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Calendar
          </Typography>
        </Toolbar>
      </AppBar>

   
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography>Loading trainings...</Typography>
          </Box>
        ) : error ? (
          <Alert severity="error">
            {error}
          </Alert>
        ) : (
          <Calendar
            localizer={localizer}
            events={events}

            date={date}
            view={view}

            onNavigate={(newDate) => setDate(newDate)}
            onView={(newView) => setView(newView)}

            views={calendarViews}

            style={{
              height: '100%',
            }}

            step={30}
            timeslots={2}
            popup

            components={{
              toolbar: CalendarToolbar,
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default CalendarView;
