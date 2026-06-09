import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { isNotificationViewed, markNotificationViewed } from '../utils/viewedNotifications';
import {
  formatNotificationDate,
  getNotificationId,
  getNotificationMessage,
  getNotificationTimestamp,
  getNotificationType,
  getTypeColor,
} from '../utils/notificationModel';
import { logInfo } from '../utils/logger';

const NotificationCard = ({ notification, index = 0, onClick }) => {
  const notificationId = getNotificationId(notification, index);
  const notificationType = getNotificationType(notification);
  const notificationMessage = getNotificationMessage(notification);
  const notificationTimestamp = getNotificationTimestamp(notification);
  const [expanded, setExpanded] = useState(false);
  const [viewed, setViewed] = useState(isNotificationViewed(notificationId));

  const handleCardClick = () => {
    if (!viewed) {
      markNotificationViewed(notificationId);
      setViewed(true);
      logInfo('Notification marked as viewed', { notificationId });
    }
    if (onClick) {
      onClick(notification);
    }
  };

  const handleExpandClick = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
    logInfo('Notification expanded', { notificationId, expanded: !expanded });
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6,
        },
        backgroundColor: viewed ? 'background.default' : 'action.hover',
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip 
              label={notificationType} 
              color={getTypeColor(notificationType)}
              size="small"
            />
            {!viewed && (
              <Chip 
                label="NEW" 
                color="error" 
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            )}
          </Box>
          <IconButton 
            onClick={handleExpandClick} 
            size="small"
            aria-expanded={expanded}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        
        <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
          {notificationMessage}
        </Typography>
        
        <Typography variant="caption" color="text.secondary">
          {formatNotificationDate(notificationTimestamp)}
        </Typography>
        
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Notification ID:</strong> {notificationId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Type:</strong> {notificationType}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Full Message:</strong> {notificationMessage}
            </Typography>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
