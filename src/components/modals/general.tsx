import { FC } from "react";
import type { PropsWithChildren } from "react";
import { Button, Fade, Modal, Stack, Typography } from "@mui/material";
import styled from "@emotion/styled";

export type GeneralModalProps = PropsWithChildren<{
  open: boolean;
  title?: string;
  onCancel: () => void;
  onSubmit?: (...args: any) => void;
}>;

const GeneralModal: FC<GeneralModalProps> = ({ open, title, onCancel, onSubmit, children }) => {
  return (
    <Modal open={open} onClose={onCancel} closeAfterTransition disableEscapeKeyDown>
      <Fade in={open}>
        <StyledModal>
          <Stack p={2} borderBottom="1px solid #E8E9EA">
            <Typography fontSize={16} fontWeight={600}>
              {title}
            </Typography>
          </Stack>
          <Stack p={2}>{children}</Stack>
          <Stack p={2} height={70} spacing={1} direction="row" justifyContent="flex-end" borderTop="1px solid #E8E9EA">
            <Button color="error" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="contained" onClick={onSubmit}>
              Submit
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

export default GeneralModal;
