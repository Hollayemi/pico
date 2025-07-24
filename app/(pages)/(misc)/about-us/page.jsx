import HomeWrapper from "@/app/components/wrapper";
import React from "react";
import { ChevronRight } from "lucide-react";

const page = () => {
  return (
    <HomeWrapper miniSlider={"miniSlider"}>
      <section className="px-11 pt-[90px] pb-[60px]">
        <div className="flex mb-[30px]">
          <ChevronRight /> <a href="/about-us">About</a>
        </div>
        <div className="about-details grid grid-cols-12">
          <div className="testimony col-span-4 sticky top-36 px-[15px]">
            <p className="text-[26px] text-brand-400 mb-[30px] font-medium">
              The school has had a profound influence on our family. The
              campaign permits us to ensure others can benefit similarly. We are
              forever grateful for the school’s ability to reinforce Christian
              values.
            </p>
            <h3 className="text-brand-200 text-[18px] font-normal">
              The Oloyede Family
            </h3>
          </div>
          <div className="history col-span-7 pl-[100px] leading-8">
            <h3 className="mb-[30px] text-[26px] text-brand-600 font-bold">
              PISO has been a cornerstone of Christian life in Ondo State and
              it's environs for over 60 years.
            </h3>
            <p className="mb-[30px]">
              <strong>
                As one of the community Christian high school in Ondo State, it
                has had an unparalleled impact and fulfills a unique role.
              </strong>{" "}
              We offer a renowned dual curriculum, academic excellence, a
              program imbued with christian values and extra-curricular
              engagement, and a strong, inclusive and supportive school
              community. Our students represent a wide range of Jewish
              backgrounds. They come from many Christian feeder schools, and our
              unique New Stream program welcomes students from secular public
              and independent schools.
            </p>
            <p className="mb-[30px]">
              <strong>Our more than 10,000 alumni </strong>
              are committed and active community members and inspired leaders in
              Toronto, in Israel, and globally. More than 20% of current
              TanenbaumCHAT staff and parents are proud graduates of the school.
            </p>
            <p>
              <strong>
                For three generations, Toronto’s Jewish community has trusted
                TanenbaumCHAT to equip our young people with the knowledge,
                character and courage to take their places in the world.
              </strong>
            </p>
          </div>
        </div>
      </section>
    </HomeWrapper>
  );
};

export default page;
