export const collectValidFormData = (
    formRef: React.RefObject<HTMLFormElement>,
  ) => {
    // Initialize an object to store form data
    const data: Record<string, any> = {};
    
    if (!formRef.current) {
      return data;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Use FormData API to get form values
    const formData = new FormData(formRef.current);
    
    // Set up shipping address
    data.shipping_address = {
      first_name: formData.get("shipping_address.first_name") || "",
      last_name: formData.get("shipping_address.last_name") || "",
      address_1: formData.get("shipping_address.address_1") || "",
      address_2: "",
      company: formData.get("shipping_address.company") || "",
      postal_code: formData.get("shipping_address.postal_code") || "",
      city: formData.get("shipping_address.city") || "",
      country_code: formData.get("shipping_address.country_code") || "",
      province: formData.get("shipping_address.province") || "",
      phone: formData.get("shipping_address.phone") || "",
    };
    
    // Set email
    let userEmail = trimValue(formData.get("email") || "");

    if (userEmail && emailRegex.test(userEmail)) {
        data.email = userEmail;
      }
    // Handle billing address based on same_as_billing checkbox
    const sameAsBilling = formData.get("same_as_billing") === "on";
    
    if (sameAsBilling) {
      data.billing_address = data.shipping_address;
    } else {
      data.billing_address = {
        first_name: formData.get("billing_address.first_name") || "",
        last_name: formData.get("billing_address.last_name") || "",
        address_1: formData.get("billing_address.address_1") || "",
        address_2: "",
        company: formData.get("billing_address.company") || "",
        postal_code: formData.get("billing_address.postal_code") || "",
        city: formData.get("billing_address.city") || "",
        country_code: formData.get("billing_address.country_code") || "",
        province: formData.get("billing_address.province") || "",
        phone: formData.get("billing_address.phone") || "",
      };
    }

    return data;
  };

  const trimValue = (val: FormDataEntryValue | null): string => 
    (val?.toString() || '').trim();
