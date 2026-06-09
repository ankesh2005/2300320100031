import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { logInfo } from '../utils/logger';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNavigation = (path) => {
    logInfo('Navigation clicked', { from: location.pathname, to: path });
    navigate(path);
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.18)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: isMobile ? '1rem' : '1.25rem',
            }}
            onClick={() => handleNavigation('/')}
          >
            Campus Notifications
          </Typography>
          
          <Box sx={{ display: 'flex', gap: isMobile ? 1 : 2 }}>
            <Tooltip title="Notifications">
              <Button
                color="inherit"
                startIcon={<NotificationsActiveIcon />}
                onClick={() => handleNavigation('/')}
                variant={location.pathname === '/' ? 'outlined' : 'text'}
                aria-label="Notifications"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  minWidth: isMobile ? 44 : 64,
                  '& .MuiButton-startIcon': { mr: isMobile ? 0 : 1 },
                }}
              >
                {isMobile ? '' : 'Notifications'}
              </Button>
            </Tooltip>
            
            <Tooltip title="Priority Inbox">
              <Button
                color="inherit"
                startIcon={<PriorityHighIcon />}
                onClick={() => handleNavigation('/priority')}
                variant={location.pathname === '/priority' ? 'outlined' : 'text'}
                aria-label="Priority Inbox"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  minWidth: isMobile ? 44 : 64,
                  '& .MuiButton-startIcon': { mr: isMobile ? 0 : 1 },
                }}
              >
                {isMobile ? '' : 'Priority Inbox'}
              </Button>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
