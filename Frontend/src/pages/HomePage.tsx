
import { Helmet } from "react-helmet";
import Banner from "../modules/home/Banner";
import CarSession from "../modules/home/CarSession";
import FilterCar from "../modules/home/FilterCar";

const HomePage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CarRentalCompany",
    "name": "VivuOto Rental",
    "description": "VivuOto là nền tảng thuê xe ô tô trực tuyến minh bạch, tiện lợi dựa trên công nghệ blockchain. Đăng ký ngay để trải nghiệm!",
    "url": "https://vivuoto-rental.vercel.app",
    "areaServed": "Vietnam",
    "priceRange": "$$"
  };
  return (
    <div>
      <Helmet>
        <title>VivuOto - Thuê xe ô tô trực tuyến minh bạch, tiện lợi dựa trên công nghệ blockchain</title>
        <meta name="title" content="VivuOto - Thuê xe ô tô trực tuyến minh bạch, tiện lợi dựa trên công nghệ blockchain" />
        <meta
          name="description"
          content="VivuOto là nền tảng thuê xe ô tô trực tuyến minh bạch, tiện lợi dựa trên công nghệ blockchain. Đăng ký ngay để trải nghiệm!"
        />
        <meta
          name="keywords"
          content="VivuOto, thuê xe ô tô, thuê xe ô tô trực tuyến, thuê xe ô tô minh bạch, thuê xe ô tô tiện lợi, thuê xe ô tô blockchain"
        />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vivuoto-rental.vercel.app" />
        <meta property="og:title" content={"VivuOto - Thuê xe ô tô trực tuyến minh bạch, tiện lợi dựa trên công nghệ blockchain"} />
        <meta
          property="og:description"
          content="VivuOto là nền tảng thuê xe ô tô trực tuyến minh bạch, tiện lợi dựa trên công nghệ blockchain. Đăng ký ngay để trải nghiệm!"
        />
        <meta property="og:image" content="https://vivuoto-rental.vercel.app/VivuOto_logo.png" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <Banner></Banner>
      <FilterCar></FilterCar>
      <CarSession title="Popular" type="popular"></CarSession>
      <CarSession title="Recommendation" type="recommend"></CarSession>
    </div>
  );
};

export default HomePage;