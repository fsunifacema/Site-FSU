## OBS
Em casos de duvida no css é só falar com os programadores front end da fabrica (Thiago e Samuel), o projeto em si ele tá apenas o front end algumas coisas como o formulario de contato tá apenas no css e js , nao tem banco de dados ainda e nem back-end ainda... (mais atualizações é só adicionar aqui)
`aviso Thiago: criei outra branch em outra linguagem (não faça nenhuma alteração)`  


## Como abrir

Abra o `index.html` no navegador, ou sirva a pasta com qualquer servidor estático:

```bash
python -m http.server 3000
```


## Recursos

- Modo claro e escuro, com a escolha salva no navegador.
- Navbar em vidro líquido com WebGL (cai para uma versão em CSS quando não há WebGL).
- Partículas no fundo, faixa de tecnologias em movimento e seções que aparecem ao rolar.
- Cards da equipe que giram e mostram a biografia, com os ícones das tecnologias de cada pessoa.
- Respeita `prefers-reduced-motion`: quem desativa animações no sistema vê a página parada.

## Estrutura

```text
index.html                 página principal
assets/css/                estilos (tema, modo claro, sidebar, componentes)
assets/js/                 interações, navbar, partículas, sidebar e temas
assets/images/             logos, fotos da equipe e ícones
assets/fonts/              fontes locais (Inter, Instrument Serif, Voltaire; licença OFL)
assets/components/         catálogo visual dos componentes
components/ui/             versão React da navbar (referência, não usada pela página)
```

## Desenvolvimento

Nada precisa ser instalado para o site. As dependências de desenvolvimento servem só para checar o componente React:

```bash
npm ci
npm run typecheck
```

Formatação com Prettier (configuração em `.prettierrc.json`):

```bash
npx prettier@3.6.2 --check "assets/**/*.{js,css,html}" index.html "components/**/*.tsx"
```


