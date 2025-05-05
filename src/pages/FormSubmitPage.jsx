import { useLocation } from "react-router-dom";
import FormSubmit from "../components/FormSubmit";

const FormSubmitPage = () => {
  const location = useLocation();
  const serviceName = location.state?.serviceName || "Document";

  return (
    <>
      <FormSubmit serviceName={serviceName} />
    </>
  );
};

export default FormSubmitPage;
