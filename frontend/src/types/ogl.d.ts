declare module 'ogl' {
  export class Renderer {
    gl: WebGL2RenderingContext;
    constructor(options?: Record<string, unknown>);
    setSize(width: number, height: number): void;
    render(options: { scene: Mesh }): void;
  }

  export class Program {
    uniforms: Record<string, { value: unknown }>;
    constructor(gl: WebGL2RenderingContext, options?: Record<string, unknown>);
  }

  export class Mesh {
    constructor(gl: WebGL2RenderingContext, options?: Record<string, unknown>);
  }

  export class Triangle {
    constructor(gl: WebGL2RenderingContext);
  }
}
