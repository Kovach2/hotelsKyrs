import Header from "../components/header";
import SimpleSlider from "../components/slider";
import Container from "../components/container";
import HotelsCards from "../components/hotelsCards";
import { useSelector } from "react-redux";

function Home() {

  const session = useSelector((state) => state.auth.isAuthenticated)
  return (
    <>
      <Header/>
      <Container>
        <div className="h-screen pt-[150px]">
          {
            !session ? <SimpleSlider/>
            :
            <div className="flex flex-col gap-[30px] pb-[30px]">
              <HotelsCards/>
            </div>
          }
          
        </div>
      </Container>
    </>
  );
}

export default Home;
