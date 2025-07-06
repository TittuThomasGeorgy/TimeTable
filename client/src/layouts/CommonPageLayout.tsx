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

const drawerWidth = 240;

const CommonPageLayout = (props: { children: React.ReactNode; title?: string; hidePageHeader?: boolean; searchOptions?: { value: string; onChange: (keyword: string) => void } }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  useEffect(() => {

  }, []);

  const drawer = (
    <div>
      {/* <Toolbar /> */}
      <Grid sx={{ height: 155 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <img src="/logo.png" alt="" style={{ height: 80, marginTop: 20 }} />
          <br />
          {/* <b></b> */}
        </div>
      </Grid>
      <Divider />
      <List>
        {allModuleRoutes
          .map((moduleRoute, index) =>
            moduleRoute.pages.map((page) =>
              !page.showInDrawer ? null : (

                <NavLink
                  to={moduleRoute.base + page.path}
                  style={({ isActive }) =>
                    !isActive ?
                      {
                        color: theme.palette.text.secondary,
                        textDecoration: 'none',
                      } :
                      {
                        color: isDark ? 'black' : 'white',
                        textDecoration: 'none',
                        backgroundColor: theme.palette.primary.main,
                      }
                  }
                  key={index}
                >
                  <ListItem disablePadding sx={{ backgroundColor: 'inherit' }}>
                    <ListItemButton>
                      {<ListItemIcon sx={{ color: 'inherit' }}>{page.icon}</ListItemIcon>}
                      <ListItemText primary={page.title} />
                    </ListItemButton>
                  </ListItem>
                </NavLink>

              ),
            ),
          )
          .flat()}
      </List>
      <Divider />
    </div>
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
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
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
              boxSizing: 'border-box',
              width: drawerWidth,
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
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
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
