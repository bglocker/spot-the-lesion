import React from "react";
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from "react-share";
import {
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@material-ui/core";

const ShareMenu: React.FC<ShareMenuProps> = ({ playerScore }: ShareMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null!);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current !== null) {
      if (anchorRef.current.contains(event.target)) {
        return;
      }
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current && !open) {
      if (anchorRef.current !== null) {
        anchorRef.current.focus();
      }
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div>
      <Button
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        Toggle Menu Grow
      </Button>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {() => (
          <Grow style={{ transformOrigin: "center top" }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={handleClose}>
                    <TwitterShareButton
                      url="http://cb3618.pages.doc.ic.ac.uk/spot-the-lesion"
                      title={`I got ${playerScore} points in Spot-the-Lesion! Can you beat my score?`}
                    >
                      <TwitterIcon size="50px" round />
                    </TwitterShareButton>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <FacebookShareButton
                      url="http://cb3618.pages.doc.ic.ac.uk/spot-the-lesion"
                      title={`I got ${playerScore} points in Spot-the-Lesion! Can you beat my score?`}
                    >
                      <FacebookIcon size="50px" round />
                    </FacebookShareButton>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default ShareMenu;
