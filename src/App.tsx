import "./styles/bootstrap.min.css";
import "./styles/all.min.css";
import "./styles/animate.css";
import "./styles/flaticon.css";
import "./styles/magnific-popup.css";
import "./styles/odometer.css";
import "./styles/owl.carousel.min.css";
import "./styles/owl.theme.default.min.css";
import "./styles/nice-select.css";
import "./styles/jquery.animatedheadline.css";
import Router from "@/routes";
import "./styles/main.css"
import LoadingComponent from "@/components/ui/LoadingComponent";

const App = () => {
  return (
    <>
      <LoadingComponent />
      <Router />
    </>
  )
}

export default App