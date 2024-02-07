import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import useAxios from "../../../hooks/use-axios";
import endpoints from "../../../api/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  deleteChat,
  updateSelectedChat,
} from "../../../redux/features/chats/chatsSlice";
import useSocket from "../../../hooks/use-socket";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export type DeleteChatDialogProps = {
  dialogOpen: boolean;
  handleDialogOpen: () => void;
  handleDialogClose: () => void;
};

export default function DeleteChatDialog({
  dialogOpen,
  handleDialogOpen,
  handleDialogClose,
}: DeleteChatDialogProps) {
const {socket} = useSocket()
  const dispatch = useDispatch();
  const selectedChat = useSelector(
    (state: RootState) => state.chats.selectedChat
  );
  const axios = useAxios();
  const deleteChats = async () => {
    try {
        socket?.emit("delete-chat", selectedChat?.id)
        return;
      await axios.delete(endpoints.CHATS + "/" + selectedChat?._id);
      dispatch(updateSelectedChat(null));
      dispatch(deleteChat(selectedChat?._id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDialogClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Delete chat"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            All your chats with this user will be permanently deleted
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={deleteChats}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
