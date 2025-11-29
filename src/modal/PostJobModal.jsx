import { Link } from "@/i18n/navigation";
import { Modal } from "rsuite";

const PostJobModal = ({ isOpen, onClose, title, signUpPath, cancelText, signUpText }) => {
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={onClose}
        size="400px"
        className="rounded-full sm:px-0 px-5"
      >
        <Modal.Header closeButton className="p-[10px]"> </Modal.Header>
        <Modal.Body className="rs-modal_bg">
          <p className="text-xl text-center mb-2 mt-2 ">
            {title}
          </p>
          <div className="flex items-center justify-center gap-4 mx-auto ">
            <button
              type="button"
              onClick={onClose}
              className=" mt-3 sm:mt-6 p-1 hover:bg-white hover:text-primary sm:py-[7px] sm:px-4 bg-primary transition-all duration-200 ease-in hover:border border border-primary hover:border-primary text-white rounded-md text-sm sm:text-base"
            >
              {cancelText}
            </button>
            <Link href={signUpPath}>
              <button
                type="button"
                className=" mt-3 sm:mt-6 p-1 hover:bg-primary hover:text-white sm:py-[7px] sm:px-4 text-primary bg-white border border-primary transition-all duration-200 ease-in hover:border hover:border-white  rounded-md text-sm sm:text-base"
              >
                {signUpText}
              </button>
            </Link>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PostJobModal;
