import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import ReactJson from 'react-json-view';
import JSONTree from 'react-json-tree';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
  list: {
    width: '100%',
    minWidth: 350,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Schedule(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button
        aria-describedby={id}
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        {props.start}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {/* <List className={classes.root}> */}
        <List className={classes.list}>
          <ListItem dense button>
            <ListItemText>Start date:</ListItemText>
            <ListItemSecondaryAction>
              {props.values.start}
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem dense button>
            <ListItemText>End date:</ListItemText>
            <ListItemSecondaryAction>
              {props.values.end}
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem dense button>
            <ListItemText>Notices:</ListItemText>
            <ListItemSecondaryAction>
              {JSON.stringify(props.values.notices)}
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem dense button>
            <ListItemText>Payments:</ListItemText>
            <ListItemSecondaryAction>
              {JSON.stringify(props.values.payments)}
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem dense button>
            <ListItemText>Amounts:</ListItemText>
            <ListItemSecondaryAction>
              {JSON.stringify(props.values.amounts)}
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Popover>
    </div>
  );
}
