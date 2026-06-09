import { useCallback, useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import TopSelector from '../components/TopSelector';
import { getPriorityNotifications } from '../services/notificationService';
import {
  formatNotificationDate,
  getNotificationId,
  getNotificationMessage,
  getNotificationTimestamp,
  getNotificationType,
  getTypeColor,
} from '../utils/notificationModel';
import { logInfo, logError } from '../utils/logger';

const PriorityPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topValue, setTopValue] = useState(10);

  const fetchPriorityNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      logInfo('Fetching priority notifications', { top: topValue });
      
      const response = await getPriorityNotifications(topValue);
      
      if (response.success) {
        setNotifications(response.notifications);
        logInfo('Priority notifications loaded successfully', { count: response.count });
      } else {
        throw new Error('Failed to fetch priority notifications');
      }
    } catch (err) {
      logError('Error fetching priority notifications', err);
      setError(err.response?.data?.message || err.message || 'Failed to load priority notifications');
    } finally {
      setLoading(false);
    }
  }, [topValue]);

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchPriorityNotifications, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchPriorityNotifications]);

  const getPriorityColor = (index) => {
    if (index === 0) return 'error';
    if (index === 1) return 'warning';
    if (index === 2) return 'info';
    return 'default';
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
          <Button variant="contained" startIcon={<RefreshIcon />} onClick={fetchPriorityNotifications}>
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
          <Paper elevation={0} sx={{ p: 3, bgcolor: 'secondary.main', color: 'white', borderRadius: 2 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <TrendingUpIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  Priority Inbox
                </Typography>
                <Typography variant="subtitle1">
                  Top {notifications.length} Priority Notifications
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <TopSelector topValue={topValue} onTopChange={setTopValue} />
        </Grid>
        
        <Grid item xs={12}>
          {notifications.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No priority notifications found
              </Typography>
            </Paper>
          ) : (
            notifications.map((notification, index) => {
              const notificationId = getNotificationId(notification, index);
              const notificationType = getNotificationType(notification);
              const notificationMessage = getNotificationMessage(notification);
              const notificationTimestamp = getNotificationTimestamp(notification);

              return (
              <Card 
                key={notificationId} 
                sx={{ 
                  mb: 2, 
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateX(8px)',
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                    <Avatar 
                      sx={{ 
                        bgcolor: `${getPriorityColor(index)}.main`,
                        width: 56,
                        height: 56,
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold">
                        #{index + 1}
                      </Typography>
                    </Avatar>
                    
                    <Box flex={1}>
                      <Box display="flex" gap={1} alignItems="center" flexWrap="wrap" mb={1}>
                        <Chip 
                          label={notificationType} 
                          color={getTypeColor(notificationType)}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatNotificationDate(notificationTimestamp)}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body1">
                        {notificationMessage}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              );
            })
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default PriorityPage;
