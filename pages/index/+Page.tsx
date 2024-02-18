import "./index.scss";
import FunImage from "./assets/fun.jpg";

interface FeatureConfig {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  callToAction: string;
}

const featureConfigs: FeatureConfig[] = [
  {
    title: "Fun and Games",
    description:
      "Bored and just search for some action? Here are can you find some funny stuff!",
    url: "/fun/memory",
    imageUrl: FunImage,
    callToAction: "Click me for fun!",
  },
];

export default function Page() {
  return (
    <main>
      <Hero />
      <Features />
    </main>
  );
}

function Hero() {
  return (
    <div className="px-4 py-5 my-5 text-center">
      <h1 className="display-5 fw-bold text-body-emphasis">Welcome!</h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead mb-4">
          Welcome to my humble page. It serves to collect my thoughts and funnel
          some ideas. What do you want to do?
        </p>
      </div>
    </div>
  );
}

function Features() {
  return (
    <div className="container">
      {featureConfigs.map((config) => {
        return (
          <>
            <hr className="featurette-divider" />
            <Featurette config={config} key={config.title} />
          </>
        );
      })}
    </div>
  );
}

function Featurette({ config }: { config: FeatureConfig }) {
  return (
    <div className="row featurette">
      <div className="col-md-7 text-center">
        <h2 className="featurette-heading fw-normal lh-1">{config.title}</h2>
        <p>{config.description}</p>
        <a className="btn btn-primary" href={config.url}> {config.callToAction}</a>
      </div>

      <div className="col-md-5">
        <a href={config.url}>
          <img
            src={config.imageUrl}
            alt={"Some image - " + config.callToAction}
            className="featurette-image img-fluid mx-auto"
          />
        </a>
      </div>
    </div>
  );
}
