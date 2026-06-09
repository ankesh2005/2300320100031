import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { logInfo } from '../utils/logger';

const NotificationFilter = ({ filterType, onFilterChange }) => {
  const notificationTypes = ['All', 'Placement', 'Result', 'Event'];

  const handleChange = (event) => {
    const newType = event.target.value;
    logInfo('Filter changed', { from: filterType, to: newType });
    onFilterChange(newType);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
        mb: 3,
        flexWrap: 'wrap',
      }}
    >
      <ToggleButtonGroup
        exclusive
        value={filterType}
        onChange={(_, value) => value && handleChange({ target: { value } })}
        size="small"
        color="primary"
        sx={{ flexWrap: 'wrap' }}
      >
        {notificationTypes.map((type) => (
          <ToggleButton key={type} value={type}>
            {type}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Box sx={{ minWidth: 220 }}>
        <FormControl fullWidth>
          <InputLabel id="notification-filter-label">Notification Type</InputLabel>
          <Select
            labelId="notification-filter-label"
            id="notification-filter"
            value={filterType}
            label="Notification Type"
            onChange={handleChange}
          >
            {notificationTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default NotificationFilter;
