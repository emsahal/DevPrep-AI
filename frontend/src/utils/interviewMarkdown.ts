export interface ExtractedCode {
  code: string[]
  cleaned: string
}

export function extractCodeBlocks(markdown: string): ExtractedCode {
  const code: string[] = []
  const cleaned = markdown
    .replace(/```[\w-]*\n?([\s\S]*?)```/g, (_m, body) => {
      code.push(body.replace(/\n+$/, ''))
      return '\n> _See the code on the next page →_'
    })
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return { code, cleaned }
}
