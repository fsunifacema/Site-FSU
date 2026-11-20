import Image from "next/image";

type Size = readonly [width: number, height: number];

type ThemeLogoProps = {
  dark: string;
  light: string;
  darkSize: Size;
  lightSize: Size;
  alt: string;
  lightAlt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function ThemeLogo({
  dark,
  light,
  darkSize,
  lightSize,
  alt,
  lightAlt = alt,
  className = "",
  sizes = "(max-width: 640px) 60vw, 400px",
  priority = false
}: ThemeLogoProps) {
  return (
    <>
      <Image
        src={dark}
        width={darkSize[0]}
        height={darkSize[1]}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className={`${className} theme-logo theme-logo--dark`}
      />
      <Image
        src={light}
        width={lightSize[0]}
        height={lightSize[1]}
        alt={lightAlt}
        sizes={sizes}
        className={`${className} theme-logo theme-logo--light`}
      />
    </>
  );
}
