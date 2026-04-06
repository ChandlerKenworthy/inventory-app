import TextInput from "../../components/forms/TextInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomerSchema, { type NewCustomerFormData } from "../../schema/CustomerSchema";
import type { APIResponse } from "../../Types";
import { customerService } from "../../services/customerService";
import { v4 as uuid } from "uuid";

interface CustomerFormProps {
  onSuccess: () => void; // tells the parent to re-fetch after submit
  setFeedback: (feedback: { type: APIResponse; message: string }) => void; // for setting success/error messages in the parent
}

export default function AddNewCustomerForm({ onSuccess, setFeedback }: CustomerFormProps) {
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
    
    const result = await customerService.add(sendData);
    setFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message
    });
    reset(); // Clear the form, whatever happens
    if (result.success) {
      onSuccess(); // Refresh the list
    }
    reset();
    onSuccess();
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