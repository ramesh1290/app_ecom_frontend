import Banner from "./components/home/Banner";
import Categories from "./components/home/Categories";
import FeaturedProducts from "./components/home/FeaturedProducts";
import Hero from "./components/home/Hero";
import Newsletter from "./components/home/NewsLetter";
import WhyChooseUs from "./components/home/WhyChooseUs";


export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Banner />
      
      <WhyChooseUs />
      <Newsletter />
    </>
  );
}