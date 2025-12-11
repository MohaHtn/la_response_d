import React, { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import { logout } from '../services/index.js';
import { ROUTES, USER_TYPES } from '../constants';
import MenuIcon from '@mui/icons-material/Menu';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ShieldIcon from '@mui/icons-material/ShieldOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';

export default function Header() {
  const { isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [isSwitching, setIsSwitching] = useState(false);
  const [pendingLang, setPendingLang] = useState(null);

  useEffect(() => {
    const onChanged = () => {
      setIsSwitching(false);
      setPendingLang(null);
    };
    i18n.on('languageChanged', onChanged);
    return () => {
      i18n.off('languageChanged', onChanged);
    };
  }, [i18n]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  const switchLang = (lng) => {
    if (!i18n.language?.startsWith(lng)) {
      setPendingLang(lng);
      setIsSwitching(true);
      i18n.changeLanguage(lng).catch(() => {
        setIsSwitching(false);
        setPendingLang(null);
      });
    }
  };

  const NavButtons = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {isAuthenticated && (
        <Button
          color="inherit"
          startIcon={<UploadFileIcon />}
          component={RouterLink}
          to={ROUTES.UPLOAD}
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
        >
          {t('nav.upload')}
        </Button>
      )}
      {isAuthenticated && userType === USER_TYPES.ADMIN && (
        <Button
          color="inherit"
          startIcon={<ShieldIcon />}
          component={RouterLink}
          to={ROUTES.ADMIN_QUARANTINE}
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
        >
          {t('nav.quarantine')}
        </Button>
      )}
      {isAuthenticated && (userType === USER_TYPES.ADMIN || userType === 'ADMIN') && (
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AdminPanelSettingsIcon />}
          component={RouterLink}
          to={ROUTES.ADMIN}
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
        >
          {t('nav.admin')}
        </Button>
      )}
      {isAuthenticated ? (
        <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
          {t('nav.logout')}
        </Button>
      ) : (
        <Button color="inherit" startIcon={<LoginIcon />} component={RouterLink} to={ROUTES.AUTH} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
          {t('nav.login')}
        </Button>
      )}
      {/* Language switcher (desktop) */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.75, ml: 1 }}>
        <Button
          size="small"
          color="secondary"
          disabled={isSwitching}
          variant={i18n.language?.startsWith('fr') ? 'contained' : 'outlined'}
          onClick={() => switchLang('fr')}
          sx={{
            minWidth: 44,
            transition: 'transform 150ms ease',
            ...(i18n.language?.startsWith('fr') && { transform: 'scale(1.05)' }),
          }}
        >
          {pendingLang === 'fr' ? (
            <CircularProgress size={14} color="inherit" />
          ) : (
            t('nav.fr')
          )}
        </Button>
        <Button
          size="small"
          color="secondary"
          disabled={isSwitching}
          variant={i18n.language?.startsWith('en') ? 'contained' : 'outlined'}
          onClick={() => switchLang('en')}
          sx={{
            minWidth: 44,
            transition: 'transform 150ms ease',
            ...(i18n.language?.startsWith('en') && { transform: 'scale(1.05)' }),
          }}
        >
          {pendingLang === 'en' ? (
            <CircularProgress size={14} color="inherit" />
          ) : (
            t('nav.en')
          )}
        </Button>
      </Box>
    </Box>
  );

  const DrawerContent = (
    <Box sx={{ width: 290 }} role="presentation" onClick={() => setOpen(false)}>
      <List>
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to={ROUTES.HOME}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary={t('nav.home')} />
            </ListItemButton>
          </ListItem>
        )}
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to={ROUTES.UPLOAD}>
              <ListItemIcon><UploadFileIcon /></ListItemIcon>
              <ListItemText primary={t('nav.uploadDoc')} />
            </ListItemButton>
          </ListItem>
        )}
        {isAuthenticated && userType === USER_TYPES.ADMIN && (
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to={ROUTES.ADMIN_QUARANTINE}>
              <ListItemIcon><ShieldIcon /></ListItemIcon>
              <ListItemText primary={t('nav.quarantine')} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <Divider />
      <List>
        {isAuthenticated && (userType === USER_TYPES.ADMIN || userType === 'ADMIN') && (
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to={ROUTES.ADMIN}>
              <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
              <ListItemText primary={t('nav.administration')} />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disablePadding>
          {isAuthenticated ? (
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary={t('nav.logout')} />
            </ListItemButton>
          ) : (
            <ListItemButton component={RouterLink} to={ROUTES.AUTH}>
              <ListItemIcon><LoginIcon /></ListItemIcon>
              <ListItemText primary={t('nav.login')} />
            </ListItemButton>
          )}
        </ListItem>
        {/* Language switcher in drawer */
        }
        <Divider />
        <ListItem disablePadding>
          <Box sx={{ display: 'flex', gap: 1, width: '100%', p: 1, justifyContent: 'center' }}>
            <Button
              size="small"
              color="secondary"
              disabled={isSwitching}
              variant={i18n.language?.startsWith('fr') ? 'contained' : 'outlined'}
              onClick={() => switchLang('fr')}
              sx={{ minWidth: 64 }}
            >
              {pendingLang === 'fr' ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                t('nav.fr')
              )}
            </Button>
            <Button
              size="small"
              color="secondary"
              disabled={isSwitching}
              variant={i18n.language?.startsWith('en') ? 'contained' : 'outlined'}
              onClick={() => switchLang('en')}
              sx={{ minWidth: 64 }}
            >
              {pendingLang === 'en' ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                t('nav.en')
              )}
            </Button>
          </Box>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar>
        <Toolbar sx={{ px: 2, gap: 1, minHeight: 64 }}>
          {isMobile && (
            <IconButton color="inherit" onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component={RouterLink}
            to={isAuthenticated ? ROUTES.HOME : ROUTES.PRESENTATION}
            style={{ textDecoration: 'none', color: 'inherit' }}
            sx={{ fontWeight: 700, flexGrow: 1 }}
          >
            {t('nav.appTitle')}
          </Typography>

          {/* Desktop actions */}
          <NavButtons />
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        {DrawerContent}
      </Drawer>
    </>
  )
}
