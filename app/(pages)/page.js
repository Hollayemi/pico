import Image from "next/image";
import HomeWrapper from "../components/wrapper";
import Button from "../components/Form/Button";
import { majorCards, stats } from "../content/landingPage";
const LandingPage = () => {

  return (
    <HomeWrapper>
      <section className="bg-gradient-to-br from-purple-50 to-brand-50">

        <div className="relative h-[90vh]">
          <img src="/images/bg1.jpg" className="absolute top-0 left-0 h-full w-full object-cover object-right-top md:object-center" />
          <div className="absolute top-0 left-0 h-full w-full bg-black opacity-60" />
          <div className="absolute flex-col h-full mt-[35vh] md:mt-[30vh] z-40 !px-3 md:!pl-20 ">
            <h1 className="!text-3xl font-black text-white !leading-8 md:!text-5xl md:!leading-14">
              Welcome to Progress  <br></br>Intellectual Schools
            </h1>
            <p className="md:w-2/5 !mt-5 !leading-8 text-white">
              Progress Intellectual School is committed to providing a
              nurturing environment that fosters academic excellence and
              personal growth. Our curriculum focuses on developing
              well-rounded individuals who are equipped to make a positive impact on the world.
            </p>
            <div className="flex items-center gap-2 md:gap-4 mt-5">
              <Button title="Apply Now" className="py-3 !rounded-full w-40 md:w-44" />
              <Button title="Admission Criteria" variant="outline" className="border-white py-3 w-44 !rounded-full text-white hover:text-black" />
            </div>
          </div>
        </div>
      </section>


      <h4 className="mx-auto w-full text-neutral-700 text-center px-2 md:6/12 lg:w-5/12 leading-9 mt-10 text-lg">
        Progress Intellectual School envisions graduates as innovative leaders and compassionate citizens who make a meaningful difference in the world.
      </h4>


      <section className="bg-white py-16 hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end ">
            <div className="md:w-10/12 flex justify-between items-center md:bg-gray-50 px-2 md:p-8 ">
              <div className="hidden md:block -ml-40">
                <div className="relative ">
                  <div className="bg-gradient-to-br z-20 w-80 h-80 from-brand-100 to-brand-200 rounded-2xl overflow-hidden shadow-xl">
                    <Image src="/images/principal.png"
                      alt="The Principal"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>
              <div className="md:w-8/12">
                <div className="mb-3 md:flex">
                  <svg className="w-8 h-8 mr-3 mb-2 md:mb-0 text-brand-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                  </svg>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    Hello. Welcome to{' '}
                    <span className="text-brand-600">Progress Intellectual School.</span>
                  </h1>
                </div>
                <div className="md:pl-8">
                  <p className="text-gray-600 text-lg text-justify leading-relaxed mb-8">
                    Our commitment is to provide each student with the tools and opportunities they need to achieve their highest potential. We strive to create an environment fostering academic excellence and personal growth.
                  </p>

                  <div className="bg-gray-50 flex items-center rounded-lg p-4 border-l-4 border-brand-600">
                    <div className="block md:hidden bg-gradient-to-br mr-4 w-12 h-12 from-brand-100 to-brand-200 rounded-full overflow-hidden shadow-xl">
                      <Image src="/images/principal.png"
                        alt="The Principal"
                        width={300}
                        height={400}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        Mr Adekunle Samuel
                      </h3>
                      <p className="text-gray-500">
                        PISO Principal
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="mb-4 transform group-hover:scale-105 transition-transform duration-300">
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-gray-600 text-sm lg:text-base font-medium">
                    {stat.label}
                  </p>
                </div>
                {/* Decorative line */}
                <div className="w-12 h-1 bg-brand-600 mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {majorCards.map((card) => (
              <div
                key={card.id}
                className="group relative h-84 md:h-80 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105"
              >
                <img src={card.backgroundImage} className="absolute top-0 left-0 h-full w-full object-cover object-right-top md:object-top" />

                <div className="absolute inset-1 md:inset-3 z-40 transform md:translate-y-[85%] md:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <div className={`w-full h-full ${card.backgroundColor} opacity-88 py-3 px-4 md:px-8 flex flex-col justify-between`}>
                    {/* Title (in hover state) */}
                    <div>
                      <h3 className="text-white text-2xl font-bold mb-6 text-center">{card.title}</h3>

                      {/* Description */}
                      <p className="text-white text-sm text-center leading-relaxed mb-5 md:mb-8">
                        {card.description}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 px-8 md:px-0">
                      {card.buttons.map((button, index) => (
                        <button
                          key={index}
                          className={`px-6 py-3 rounded-md font-medium text-sm transition-all duration-200 ${button.style} flex-1`}
                        >
                          {button.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subtle gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>


    </HomeWrapper>
  );
};

export default LandingPage;