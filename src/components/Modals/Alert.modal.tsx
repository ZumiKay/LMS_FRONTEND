import * as React from "react";
import { useShowToast } from "../../config/customHook";
import { useGlobalContext } from "../../types/context.type";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

interface AlertDialogProps {
  onAgree: () => Promise<{
    success: boolean;
    data?: unknown;
    totalpage?: number;
    error?: unknown;
    message?: string;
    schooldata?: unknown;
    totalcount?: number;
  }>;
  label?: string;
  description?: string;
  onClose?: () => void;
  onDelete?: () => void;
}
export default function AlertDialog({
  onAgree,
  label,
  description,
  onDelete,
}: AlertDialogProps) {
  const { ErrorToast, SuccessToast } = useShowToast();
  const { setopenmodal, openmodal, setglobalindex, globalindex } =
    useGlobalContext();
  const [loading, setloading] = React.useState(false);

  const handleAgree = async () => {
    setloading(true);
    const req = await onAgree();
    setloading(false);

    if (!req.success) {
      ErrorToast("Can't Delete");
      return;
    }
    SuccessToast("Deleted");
    setopenmodal({ deleteModal: false });

    if (onDelete) onDelete();

    if (globalindex !== -1) setglobalindex(-1);
  };

  return (
    <Modal
      isOpen={openmodal.deleteModal}
      onOpenChange={(val) => {
        if (globalindex !== -1) setglobalindex(-1);
        setopenmodal({ deleteModal: val });
      }}
    >
      <ModalContent>
        {(onclose) => (
          <>
            <ModalHeader>{label ?? "Are you sure?"}</ModalHeader>
            <ModalBody>
              <p className="text-lg font-medium w-full h-fit">{description}</p>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onClick={() => onclose()}>
                Close
              </Button>
              <Button
                color="primary"
                variant="flat"
                isLoading={loading}
                onClick={() => handleAgree()}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export function ImageModal({
  url,
  close,
}: {
  url: string;
  close?: () => void;
}) {
  const { openmodal, setopenmodal } = useGlobalContext();

  return (
    <Modal
      className="z-auto"
      isOpen={openmodal.imageModal}
      onOpenChange={(val) => setopenmodal({ imageModal: val })}
      placement="center"
      closeButton
      onClose={() => {
        if (close) close();
      }}
    >
      <ModalContent>
        <ModalBody>
          <Image className="w-[300px] h-[300px]" src={url} alt={url} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
