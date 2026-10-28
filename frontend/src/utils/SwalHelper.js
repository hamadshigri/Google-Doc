import Swal from "sweetalert2";

export const handleConfirmation = (title, text) => {
  return Swal.fire({
    title: title || "Are you sure?",
    text: text || "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#437993",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    confirmButtonColor: "#437993"
  });
};