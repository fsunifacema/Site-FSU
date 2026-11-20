import Image from "next/image";

export function TeamSection() {
  return (
    <section id="quem-somos" className="developers-section" aria-labelledby="developers-title">
      <div className="container" data-reveal="">
        <div className="developers-header">
          <span className="developers-kicker">QUEM SOMOS / FSU</span>
          <h2 id="developers-title" className="section-title">
            {"As pessoas por trás "}
            <span className="text-highlight">do código.</span>
          </h2>
          <p className="section-desc">
            Conheça os desenvolvedores da Fábrica de Software. Passe o cursor, toque ou use o teclado para explorar cada
            perfil.
          </p>
        </div>
        <div className="developers-gallery" aria-label="Desenvolvedores da FSU">
          <article
            className="developer-card developer-card--thiago developer-card--flip is-active"
            aria-label="Thiago José"
          >
            <button
              className="developer-flip-trigger"
              type="button"
              aria-pressed="true"
              aria-label="Ver biografia de Thiago José"
              aria-expanded="false"
              aria-controls="bio-thiago"
            >
              <span className="developer-card-front">
                <span className="developer-card-number" aria-hidden="true">
                  01 / 09
                </span>{" "}
                <span className="developer-card-art has-photo" aria-hidden="true">
                  <Image
                    src="/assets/images/thiago.webp"
                    width={600}
                    height={800}
                    sizes="(max-width: 640px) 80vw, 420px"
                    className="developer-card-photo"
                    alt=""
                  />
                  <span className="developer-photo-initials">T</span>
                </span>{" "}
                <span className="developer-card-details">
                  <span className="developer-card-role">Desenvolvedor front-end</span>{" "}
                  <strong className="developer-card-name">Thiago José</strong>
                </span>{" "}
                <span className="developer-card-hint">Clique para conhecer</span>
              </span>{" "}
              <span className="developer-card-back" id="bio-thiago" aria-hidden="true">
                <span className="developer-card-role">Desenvolvedor front-end</span>{" "}
                <strong className="developer-bio-name">Thiago José</strong>{" "}
                <span className="developer-bio-text">
                  Olá! Sou Thiago José, desenvolvedor front-end e estudante de Análise e Desenvolvimento de Sistemas. Na
                  FSU do UniFacema, desenvolvo o front-end de projetos como este site e o Caxias Infraestruturas (CI).
                  Utilizo tecnologias como HTML5, CSS3, JavaScript, TypeScript, React, React Native, Tailwind CSS e PHP
                  Native. Atualmente, busco ampliar meu repertório de tecnologias e conhecimentos para aprimorar o
                  design de interfaces profissionais e empresariais. Também estudo métricas de experiência do usuário
                  (UX) e como o framework HEART, do Google, organiza essas medidas, incluindo a satisfação do usuário.
                  Na minha visão, o front-end é a primeira oportunidade de captar a atenção do cliente e despertar seu
                  interesse.
                </span>{" "}
                <span className="developer-bio-return">Clique para voltar à foto</span>
              </span>
            </button>{" "}
            <a
              className="developer-github"
              href="https://github.com/THiagALmeida"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub de Thiago José (abre em nova aba)"
              title="GitHub de Thiago José"
              tabIndex={-1}
            >
              <img src="/assets/images/technologies/github.svg" width={24} height={24} alt="" />
            </a>
          </article>
          <button className="developer-card" type="button" aria-pressed="false" aria-label="Conhecer Samuel">
            <span className="developer-card-number" aria-hidden="true">
              02 / 09
            </span>{" "}
            <span className="developer-card-art has-photo" aria-hidden="true">
              <Image
                src="/assets/images/samuel.webp"
                width={498}
                height={800}
                sizes="(max-width: 640px) 80vw, 420px"
                className="developer-card-photo"
                alt=""
              />
              <span className="developer-photo-initials">S</span>
            </span>{" "}
            <span className="developer-card-details">
              <span className="developer-card-role">Desenvolvedor da FSU</span>{" "}
              <strong className="developer-card-name">Samuel</strong>
            </span>
          </button>{" "}
          <button
            className="developer-card developer-card--marcelo developer-card--flip"
            type="button"
            aria-pressed="false"
            aria-label="Ver biografia de João Marcelo"
            aria-expanded="false"
            aria-controls="bio-marcelo"
          >
            <span className="developer-card-front">
              <span className="developer-card-number" aria-hidden="true">
                03 / 09
              </span>{" "}
              <span className="developer-card-art has-photo" aria-hidden="true">
                <Image
                  src="/assets/images/joao-marcelo.webp"
                  width={600}
                  height={800}
                  sizes="(max-width: 640px) 80vw, 420px"
                  className="developer-card-photo"
                  alt=""
                />
                <span className="developer-photo-initials">JM</span>
              </span>{" "}
              <span className="developer-card-details">
                <span className="developer-card-role">Desenvolvedor back-end</span>{" "}
                <strong className="developer-card-name">João Marcelo</strong>
              </span>{" "}
              <span className="developer-card-hint">Clique para conhecer</span>
            </span>{" "}
            <span className="developer-card-back" id="bio-marcelo" aria-hidden="true">
              <span className="developer-card-role">Desenvolvedor back-end</span>{" "}
              <strong className="developer-bio-name">João Marcelo</strong>{" "}
              <span className="developer-bio-text">
                Sou o João Marcelo, desenvolvedor back-end e estudante de Engenharia de Software e Análise e
                Desenvolvimento de Sistemas. Na Fábrica de Software do UniFacema, desenvolvo o back-end de sistemas
                institucionais com PHP, Laravel e Docker, crio funcionalidades de organização, controle e análise de
                dados, apoio o front-end com React, JavaScript, HTML5 e CSS3 e gerencio redes e servidores físicos e
                virtuais. Minha experiência como redator e professor me ajuda a comunicar com clareza e a explicar
                soluções técnicas. Busco estágio em desenvolvimento de sistemas e engenharia de software.
              </span>{" "}
              <span className="developer-bio-return">Clique para voltar à foto</span>
            </span>
          </button>{" "}
          <button
            className="developer-card developer-card--icaro developer-card--flip"
            type="button"
            aria-pressed="false"
            aria-label="Ver biografia de Ícaro Mairon"
            aria-expanded="false"
            aria-controls="bio-icaro"
          >
            <span className="developer-card-front">
              <span className="developer-card-number" aria-hidden="true">
                04 / 09
              </span>{" "}
              <span className="developer-card-art has-photo" aria-hidden="true">
                <Image
                  src="/assets/images/Icaro.webp"
                  width={600}
                  height={800}
                  sizes="(max-width: 640px) 80vw, 420px"
                  className="developer-card-photo"
                  alt=""
                />
                <span className="developer-photo-initials">IM</span>
              </span>{" "}
              <span className="developer-card-details">
                <span className="developer-card-role">Desenvolvedor frontend</span>{" "}
                <strong className="developer-card-name">Ícaro Mairon</strong>
              </span>{" "}
              <span className="developer-card-hint">Clique para conhecer</span>
            </span>{" "}
            <span className="developer-card-back" id="bio-icaro" aria-hidden="true">
              <span className="developer-card-role">Desenvolvedor frontend</span>{" "}
              <strong className="developer-bio-name">Ícaro Mairon</strong>{" "}
              <span className="developer-bio-text">Técnico em Informática (IFMA) e estudante de ADS na UniFacema.</span>{" "}
              <span className="developer-bio-return">Clique para voltar à foto</span>
            </span>
          </button>{" "}
          <button
            className="developer-card developer-card--carlos developer-card--flip"
            type="button"
            aria-pressed="false"
            aria-label="Ver biografia de Carlos Henrique"
            aria-expanded="false"
            aria-controls="bio-carlos"
          >
            <span className="developer-card-front">
              <span className="developer-card-number" aria-hidden="true">
                05 / 09
              </span>{" "}
              <span className="developer-card-art has-photo" aria-hidden="true">
                <Image
                  src="/assets/images/Carlos.webp"
                  width={800}
                  height={800}
                  sizes="(max-width: 640px) 80vw, 420px"
                  className="developer-card-photo"
                  alt=""
                />
                <span className="developer-photo-initials">CH</span>
              </span>{" "}
              <span className="developer-card-details">
                <span className="developer-card-role">Desenvolvedor back-end</span>{" "}
                <strong className="developer-card-name">Carlos Henrique</strong>
              </span>{" "}
              <span className="developer-card-hint">Clique para conhecer</span>
            </span>{" "}
            <span className="developer-card-back" id="bio-carlos" aria-hidden="true">
              <span className="developer-card-role">Desenvolvedor back-end</span>{" "}
              <strong className="developer-bio-name">Carlos Henrique</strong>{" "}
              <span className="developer-bio-text">
                Graduando do 4º período de Análise e Desenvolvimento de Sistemas (ADS) na UniFacema, integra a equipe da
                Fábrica de Software, atuando no desenvolvimento de sistemas e soluções tecnológicas. Com atuação voltada
                ao desenvolvimento de software, aprimoramento técnico e colaboração em projetos tecnológicos.
              </span>{" "}
              <span className="developer-bio-return">Clique para voltar à foto</span>
            </span>
          </button>
          <article className="developer-card developer-card--felipe developer-card--flip" aria-label="Felipe Serejo">
            <button
              className="developer-flip-trigger"
              type="button"
              aria-pressed="false"
              aria-label="Ver biografia de Felipe Serejo"
              aria-expanded="false"
              aria-controls="bio-felipe"
            >
              <span className="developer-card-front">
                <span className="developer-card-number" aria-hidden="true">
                  06 / 09
                </span>{" "}
                <span className="developer-card-art has-photo" aria-hidden="true">
                  <Image
                    src="/assets/images/felipe-serejo.webp"
                    width={458}
                    height={800}
                    sizes="(max-width: 640px) 80vw, 420px"
                    className="developer-card-photo"
                    alt=""
                  />
                  <span className="developer-photo-initials">FS</span>
                </span>{" "}
                <span className="developer-card-details">
                  <span className="developer-card-role">Desenvolvedor web em formação</span>{" "}
                  <strong className="developer-card-name">Felipe Serejo</strong>
                </span>{" "}
                <span className="developer-card-hint">Clique para conhecer</span>
              </span>{" "}
              <span className="developer-card-back" id="bio-felipe" aria-hidden="true">
                <span className="developer-card-role">Desenvolvedor web em formação</span>{" "}
                <strong className="developer-bio-name">Felipe Serejo</strong>{" "}
                <span className="developer-bio-text">
                  Sou estudante de Análise e Desenvolvimento de Sistemas (ADS) no UniFacema e desenvolvedor web em
                  formação. Atualmente, atuo no setor de Tecnologia da Informação (TI) do SAAE, conciliando minha
                  experiência profissional com a graduação e a formação técnica em Cibersistemas para Automação pelo
                  SENAI.
                </span>{" "}
                <span className="developer-bio-text developer-bio-paragraph">
                  Tenho foco em TypeScript, Next.js e Laravel, além de interesse em bancos de dados, infraestrutura,
                  Linux, automação e cibersegurança.
                </span>{" "}
                <span className="developer-bio-text developer-bio-paragraph">
                  Gosto de desenvolver sistemas e ferramentas que resolvam problemas reais, buscando constantemente
                  aprimorar meus conhecimentos e evoluir profissionalmente na área de tecnologia.
                </span>{" "}
                <span className="developer-bio-return">Clique para voltar à foto</span>
              </span>
            </button>{" "}
            <a
              className="developer-github"
              href="https://github.com/sshs3rejo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub de Felipe Serejo (abre em nova aba)"
              title="GitHub de Felipe Serejo"
              tabIndex={-1}
            >
              <img src="/assets/images/technologies/github.svg" width={24} height={24} alt="" />
            </a>
          </article>
          <article className="developer-card developer-card--isac developer-card--flip" aria-label="Isac Chaves">
            <button
              className="developer-flip-trigger"
              type="button"
              aria-pressed="false"
              aria-label="Ver biografia de Isac Chaves"
              aria-expanded="false"
              aria-controls="bio-isac"
            >
              <span className="developer-card-front">
                <span className="developer-card-number" aria-hidden="true">
                  07 / 09
                </span>{" "}
                <span className="developer-card-art has-photo" aria-hidden="true">
                  <Image
                    src="/assets/images/isac.webp"
                    width={542}
                    height={800}
                    sizes="(max-width: 640px) 80vw, 420px"
                    className="developer-card-photo"
                    alt=""
                  />
                  <span className="developer-photo-initials">I</span>
                </span>{" "}
                <span className="developer-card-details">
                  <span className="developer-card-role">Desenvolvedor web em formação</span>{" "}
                  <strong className="developer-card-name">Isac Chaves</strong>
                </span>{" "}
                <span className="developer-card-hint">Clique para conhecer</span>
              </span>{" "}
              <span className="developer-card-back" id="bio-isac" aria-hidden="true">
                <span className="developer-card-role">Desenvolvedor web em formação</span>{" "}
                <strong className="developer-bio-name">Isac Chaves</strong>{" "}
                <span className="developer-bio-text">
                  Isac Chaves Ghilardi Figueiras é estudante do UniFacema e desenvolvedor em formação, com foco em
                  desenvolvimento web com JavaScript e PHP.
                </span>{" "}
                <span className="developer-bio-text developer-bio-paragraph">
                  Além do código, tem experiência em criação de jogos no Roblox, modelagem 3D no Blender e edição de
                  vídeo no DaVinci Resolve, uma combinação que une lógica, design e criatividade. Na faculdade, vem se
                  aprofundando em teste e segurança de software.
                </span>{" "}
                <span className="developer-bio-text developer-bio-paragraph">
                  Na Fábrica de Software, busca transformar ideias em soluções funcionais, bem construídas e agradáveis
                  de usar.
                </span>{" "}
                <span className="developer-bio-return">Clique para voltar à foto</span>
              </span>
            </button>
          </article>
          <button
            className="developer-card developer-card--davi developer-card--flip"
            type="button"
            aria-pressed="false"
            aria-label="Ver biografia de Davi"
            aria-expanded="false"
            aria-controls="bio-davi"
          >
            <span className="developer-card-front">
              <span className="developer-card-number" aria-hidden="true">
                08 / 09
              </span>{" "}
              <span className="developer-card-art has-photo" aria-hidden="true">
                <Image
                  src="/assets/images/Davi.webp"
                  width={594}
                  height={800}
                  sizes="(max-width: 640px) 80vw, 420px"
                  className="developer-card-photo"
                  alt=""
                />
                <span className="developer-photo-initials">D</span>
              </span>{" "}
              <span className="developer-card-details">
                <span className="developer-card-role">Analista de Sistemas</span>{" "}
                <strong className="developer-card-name">Davi</strong>
              </span>{" "}
              <span className="developer-card-hint">Clique para conhecer</span>
            </span>{" "}
            <span className="developer-card-back" id="bio-davi" aria-hidden="true">
              <span className="developer-card-role">Analista de Sistemas</span>{" "}
              <strong className="developer-bio-name">Davi</strong>{" "}
              <span className="developer-bio-text">
                Olá! Sou o Davi, estudante de Análise e Desenvolvimento de Sistemas na UniFacema, em Caxias (MA), com
                formatura prevista para o início de 2027. Sou bolsista PIBIC, com pesquisa em machine learning aplicado
                à saúde, e atuo como Analista de Sistemas na Fábrica de Software da UniFACEMA.
              </span>{" "}
              <span className="developer-bio-return">Clique para voltar à foto</span>
            </span>
          </button>{" "}
          <button
            className="developer-card developer-card--reony"
            type="button"
            aria-pressed="false"
            aria-label="Conhecer Reony"
          >
            <span className="developer-card-number" aria-hidden="true">
              09 / 09
            </span>{" "}
            <span className="developer-card-art has-photo" aria-hidden="true">
              <Image
                src="/assets/images/reony.webp"
                width={800}
                height={800}
                sizes="(max-width: 640px) 80vw, 420px"
                className="developer-card-photo"
                alt=""
              />
              <span className="developer-photo-initials">R</span>
            </span>{" "}
            <span className="developer-card-details">
              <span className="developer-card-role">Desenvolvedor da FSU</span>{" "}
              <strong className="developer-card-name">Reony</strong>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
