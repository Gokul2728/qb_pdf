import { Backdrop, Box, Fade, Modal, Typography } from "@mui/material";
import "./style.css";

function CustomDialog(props) {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={props.open}
      onClose={props.handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="custom-dialog"
        style={{
          width: `${props.preview ? "225mm" : ""}`,
        }}
      >
        <Fade in={props.open}>
          <Box>
            <div className="dialogy-header flex justify-between items-center">
              <Typography
                className="flex justify-center"
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                {props.title}
              </Typography>
              {props.action}
            </div>
            {props.body}
          </Box>
        </Fade>
      </div>
    </Modal>
  );
}

export default CustomDialog;
