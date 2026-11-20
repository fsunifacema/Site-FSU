const TECHNOLOGIES = [
  { name: "React", icon: "react" },
  { name: "JavaScript", icon: "javascript" },
  { name: "Tailwind", icon: "tailwind" },
  { name: "Nuxt", icon: "nuxt" },
  { name: "VS Code", icon: "vs-code" },
  { name: "Vue", icon: "vue" },
  { name: "Angular", icon: "angular" },
  { name: "Figma", icon: "figma" },
  { name: "Claude", icon: "claude" },
  { name: "ChatGPT", icon: "chatgpt" },
  { name: "Slack", icon: "slack" }
];

const COPIES = 3;

export function TechMarquee() {
  return (
    <section className="marquee-band" aria-label="Tecnologias em destaque">
      <canvas className="particle-field particle-field-marquee" data-particle-field="marquee" aria-hidden="true" />
      <div className="marquee-container">
        <div className="marquee-viewport">
          <div className="marquee-track">
            <span className="marquee-glass" aria-hidden="true" />
            {Array.from({ length: COPIES }, (_, copy) => (
              <div key={copy} className="marquee-group" aria-hidden={copy > 0 ? "true" : undefined}>
                {TECHNOLOGIES.map((technology) => (
                  <span key={technology.icon} className="marquee-item">
                    <img src={`/assets/images/marquee/${technology.icon}.svg`} alt="" />
                    {technology.name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
