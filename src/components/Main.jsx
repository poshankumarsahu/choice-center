import ServicesPage from "../pages/ServicesPage";
import Footer from "./Footer";
import FormSubmit from "./FormSubmit";
import Slider from "./Slider";
import Tabs from "./Tabs";

const Main = () => {
  return (
    <div className="flex flex-col space-y-6">
      {" "}
      {/* Added space-y-6 for consistent spacing */}
      <Tabs />
      <Slider />
      <FormSubmit />
      <ServicesPage />
    </div>
  );
};

export default Main;
