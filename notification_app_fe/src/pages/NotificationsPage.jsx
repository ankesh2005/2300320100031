import { useCallback, useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Pagination,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Button,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationCard from '../components/NotificationCard';
import NotificationFilter from '../components/NotificationFilter';
import { getNotifications } from '../services/notificationService';
import { getNotificationId } from '../utils/notificationModel';
import { logInfo, logError } from '../utils/logger';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState('All');
  const [limit] = useState(10);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      logInfo('Fetching notifications page', { page, filterType });
      
      const response = await getNotifications(page, limit, filterType);
      
      if (response.success) {
        const items = response.notifications || [];
        setNotifications(items);
        setTotalPages(items.length === limit ? page + 1 : page);
        logInfo('Notifications loaded successfully', { count: items.length, page });
      } else {
        throw new Error('Failed to fetch notifications');
      }
    } catch (err) {
      logError('Error fetching notifications', err);
      setError(err.response?.data?.message || err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [filterType, limit, page]);

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchNotifications, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchNotifications]);

  const handlePageChange = (event, value) => {
    setPage(value);
    logInfo('Page changed', { newPage: value });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilter) => {
    setFilterType(newFilter);
    setPage(1);
    logInfo('Filter applied', { filter: newFilter });
  };

  const handleNotificationClick = (notification) => {
    logInfo('Notification clicked', { notificationId: notification.id });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" startIcon={<RefreshIcon />} onClick={fetchNotifications}>
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Notifications Center
            </Typography>
            <Typography variant="subtitle1">
              Showing {notifications.length} notification{notifications.length === 1 ? '' : 's'} on page {page}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <NotificationFilter 
            filterType={filterType} 
            onFilterChange={handleFilterChange} 
          />
        </Grid>
        
        <Grid item xs={12}>
          {notifications.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No notifications found
              </Typography>
            </Paper>
          ) : (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, minmax(0, 1fr))',
                    lg: 'repeat(3, minmax(0, 1fr))',
                  },
                  gap: 2,
                  alignItems: 'stretch',
                }}
              >
                {notifications.map((notification, index) => (
                  <NotificationCard
                    key={getNotificationId(notification, index)}
                    notification={notification}
                    index={index}
                    onClick={handleNotificationClick}
                  />
                ))}
              </Box>
              
              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default NotificationsPage;
