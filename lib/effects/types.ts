export type Cleanup = () => void;

export function mountEach<T extends Element>(selector: string, mount: (element: T) => Cleanup): Cleanup {
  const cleanups = [...document.querySelectorAll<T>(selector)].map(mount);
  return () => cleanups.forEach((cleanup) => cleanup());
}
