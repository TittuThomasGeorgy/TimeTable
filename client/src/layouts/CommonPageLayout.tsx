import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useTheme, TextField,
  Avatar,
  Stack,
  Menu,
  MenuItem,
} from '@mui/material';
import { Logout as LogoutIcon, Menu as MenuIcon, Person as PersonIcon, Search as SearchIcon } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { allModuleRoutes } from '../routes/routes';


const CommonPageLayout = (props: { children: React.ReactNode; title?: string; hidePageHeader?: boolean; searchOptions?: { value: string; onChange: (keyword: string) => void } }) => {
  const theme = useTheme();

  // Initialize isCollapsed state from localStorage, defaulting to true if not found
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const savedState = localStorage.getItem('isDrawerCollapsed');
    return savedState !== null ? JSON.parse(savedState) : true; // Default to true (collapsed)
  });

  // Save isCollapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isDrawerCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const handleDrawerToggle = () => {
    setIsCollapsed(!isCollapsed)
  };
  const drawerWidth = isCollapsed ? 70 : 240;

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  useEffect(() => {

  }, []);

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        width: drawerWidth,
        transition: 'width 0.3s',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          py: 2,
        }}
      >
        <img src="/logo.png" alt="Logo" style={{ height: 40 }} />
      </Box>

      <Divider />

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Box textAlign="left" p={1}>
          <IconButton onClick={() => { setIsCollapsed(!isCollapsed); }}>
            <MenuIcon />
          </IconButton>
        </Box>
        <List>
          {allModuleRoutes.map((moduleRoute, idx) => (
            <Box key={idx}>
              {/* {moduleRoute.title && !isCollapsed && (
                <Typography variant="caption" sx={{ pl: 2, mt: 2, fontWeight: 600 }}>
                  {moduleRoute.title}
                </Typography>
              )} */}

              {moduleRoute.pages.map((page, index) =>
                page.showInDrawer ? (
                  <Tooltip key={index} title={isCollapsed ? page.title : ''} placement="right">
                    <NavLink
                      to={moduleRoute.base + page.path}
                      style={({ isActive }) => ({
                        textDecoration: 'none',
                        color: isActive
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                        backgroundColor: 'transparent',
                        borderRadius: '0 20px 20px 0',
                        transition: 'all 0.3s',
                        display: 'block',
                        margin: '4px 8px',
                      })}
                    >
                      {({ isActive }) => ( // Access isActive here
                        <ListItem disablePadding>
                          <ListItemButton
                            sx={{
                              borderRadius: '20px ',
                              justifyContent: isCollapsed ? 'center' : 'flex-start',
                              borderBottom: isActive ? '2px solid ' : 'none', // Thickness (5px), style (solid), color (black)
                              borderColor: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                              pb: 1, // Optional: Add some padding-bottom so content doesn't touch the border

                            }}
                          >
                            <ListItemIcon
                              sx={{
                                // Now isActive is available here
                                color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                                minWidth: 0,
                                mr: isCollapsed ? 0 : 2,
                              }}
                            >
                              {page.icon}
                            </ListItemIcon>
                            {!isCollapsed && <ListItemText primary={page.title} />}
                          </ListItemButton>
                        </ListItem>
                      )}
                    </NavLink>
                  </Tooltip>
                ) : null
              )}
            </Box>
          ))}
        </List>
      </Box>
    </Box>
  );


  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          transition: 'width 0.3s ease',
        }}
      >
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {import.meta.env.VITE_API_NAME}
          </Typography>
          {/* <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              sx={{ ml: 'auto' }}
              onClick={() => {
                // subscribe();
              }}
              component={Link}
              to="/notification"
            >
              <Badge badgeContent={notificationsCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip> */}
          &nbsp;&nbsp;
          <Tooltip title="Profile">
            <Box onClick={handleOpenUserMenu} sx={{ p: 0, ml: 'auto' }} color="inherit">
              <Stack direction="row"
                spacing={2}>
                <Avatar aria-label="" />
                <Stack direction="column"
                  spacing={0}>
                  <Typography variant="body1" color="initial">
                    {/* {(curSchool.school as ISchool).name} */}
                  </Typography>
                  <Typography variant="caption" color="initial">
                    {/* {(curSchool.school as ISchool).code} */}
                  </Typography>
                </Stack>
              </Stack>
              {/* <PersonIcon fontSize="large" /> */}
            </Box>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appBar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={() => setAnchorElUser(null)}
          >
            <MenuItem component={Link} to={`/school/`} onClick={() => setAnchorElUser(null)}>
              <PersonIcon />
              <Typography textAlign="center" alignItems={"center"}>
                Profile</Typography>
            </MenuItem>
            <MenuItem onClick={async () => {
              // await unsubscribe();
              setAnchorElUser(null);
              localStorage.removeItem('curSchoolId');
              localStorage.removeItem('curSchool');
              // curSchool.setSchool(false);
              navigate('/login');
            }}>
              <LogoutIcon />
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
        {/* {loader.count != undefined && loader.count > 0 && <LinearProgress />} */}
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: 0 }} >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={!isCollapsed}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            'display': { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            'display': { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: isCollapsed ? 70 : drawerWidth,
              transition: 'width 0.3s ease',
              overflowX: 'hidden',
              boxSizing: 'border-box',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          transition: 'width 0.3s ease',
        }}
      >
        <Toolbar />
        {props.title && !props.hidePageHeader && (
          <>
            <Grid container spacing={0}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h4">{props.title}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                {props.searchOptions && (
                  <TextField
                    id="Search"
                    placeholder="Search"
                    value={props.searchOptions.value}
                    onChange={(e) => {
                      props.searchOptions?.onChange(e.target.value)
                    }}
                    variant='standard'
                    sx={{ float: 'right' }}
                    InputProps={{
                      startAdornment: <SearchIcon />
                    }}
                  />)}
              </Grid>
            </Grid>
            <Divider />
            <br />
          </>
        )}
        {props.children}
      </Box>

    </Box >
  );
};

export default CommonPageLayout;
