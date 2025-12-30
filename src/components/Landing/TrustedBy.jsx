const TrustedBy = () => {
  const logos = ["HubSpot", "Slack", "Gmail", "Healthtech", "EdTech"];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <p className="text-center text-muted-foreground text-lg mb-8 font-['Inter']">
          Used by 100+ growing businesses worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="text-2xl font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors font-['Inter']"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
