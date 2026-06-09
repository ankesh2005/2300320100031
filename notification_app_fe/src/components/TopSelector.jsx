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

const TopSelector = ({ topValue, onTopChange }) => {
  const topOptions = [10, 15, 20];

  const handleChange = (event) => {
    const newValue = event.target.value;
    logInfo('Top N selector changed', { from: topValue, to: newValue });
    onTopChange(newValue);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <ToggleButtonGroup
          exclusive
          value={topValue}
          onChange={(_, value) => value && handleChange({ target: { value } })}
          size="small"
          color="secondary"
        >
          {topOptions.map((option) => (
            <ToggleButton key={option} value={option}>
              Top {option}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="top-selector-label">Priority Count</InputLabel>
          <Select
            labelId="top-selector-label"
            id="top-selector"
            value={topValue}
            label="Priority Count"
            onChange={handleChange}
          >
            {topOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
    </Box>
  );
};

export default TopSelector;
