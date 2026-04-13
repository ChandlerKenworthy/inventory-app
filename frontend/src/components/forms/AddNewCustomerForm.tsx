import TextInput from "../../components/forms/TextInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomerSchema, { type NewCustomerFormData } from "../../schema/CustomerSchema";
import { customerService } from "../../services/customerService";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";

interface CustomerFormProps {
  onSuccess: () => void; // tells the parent to re-fetch after submit
}

export default function AddNewCustomerForm({ onSuccess }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewCustomerFormData>({
    resolver: zodResolver(CustomerSchema),
    mode: "onChange",
    defaultValues: {
      first_name: "",
      second_name: "",
      email: "",
    },
  });

  const onSubmit = async (data: NewCustomerFormData) => {
    const sendData = {
      ...data,
      id: uuid() // Generate a new UUID for the customer ID on form submission
    }
    toast.promise(
      customerService.add(sendData),
      {
        loading: 'Adding customer...',
        success: (result) => {
          if (!result.success) throw new Error(result.message); // Catch logic errors
          reset();
          onSuccess();
          return "Customer added successfully";
        },
        error: (err) => {
          reset();
          onSuccess();
          return `Error: ${err.message || "Could not add customer"}`;
        },
      }
    );
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="first_name"
        description="First Name"
        error={errors.first_name?.message}
        {...register("first_name")}
      />
      <TextInput
        label="second_name"
        description="Second Name"
        error={errors.second_name?.message}
        {...register("second_name")}
      />
      <TextInput
        label="email"
        description="Email"
        input_type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <button type="submit">Add Customer</button>
    </form>
  );
}