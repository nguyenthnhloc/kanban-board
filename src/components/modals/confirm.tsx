import { FC } from "react";
import type { PropsWithChildren } from "react";
import { Button, Fade, Modal, Stack, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { Delete, Info } from "@mui/icons-material";

export type ConfirmModalType = "delete" | "confirm";

export type ConfirmModalProps = PropsWithChildren<{
  type: ConfirmModalType;
  open: boolean;
  title?: string;
  onCancel: () => void;
  onSubmit?: (...args: any) => void;
}>;

const ConfirmModal: FC<ConfirmModalProps> = ({ type, open, title, onCancel, onSubmit, children }) => {
  return (
    <Modal open={open} onClose={onCancel} closeAfterTransition disableEscapeKeyDown>
      <Fade in={open}>
        <StyledModal>
          <Stack p={2} alignItems="center">
            <Stack p={2} mb={2} style={{ backgroundColor: type === "delete" ? "#fff1f0" : "" }} borderRadius={100}>
              {type === "delete" ? <Delete color="error" fontSize="large" /> : <Info fontSize="large" />}
            </Stack>
            <Typography mb={2} fontSize={20} fontWeight={600}>
              {title}
            </Typography>
            <Stack px={2}>{children}</Stack>
          </Stack>
          <Stack p={2} height={70} spacing={1} direction="row" justifyContent="flex-end" borderTop="1px solid #E8E9EA">
            <Button fullWidth color="info" variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button fullWidth color="error" variant="contained"onClick={onSubmit}>
              Delete
            </Button>
          </Stack>
        </StyledModal>
      </Fade>
    </Modal>
  );
};

const StyledModal = styled(Stack)`
  top: 50%;
  left: 50%;
  width: 90%;
  position: absolute;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  background-color: white;

  @media screen and (min-width: 600px) {
    width: 400px;
  }
`;

export default ConfirmModal;
