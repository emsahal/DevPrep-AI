import { Request, Response, NextFunction } from 'express'
import { searchService } from '@/services/search.service'

export class SearchController {
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = req.query
      const results = await searchService.search((q as string) || '')
      res.json(results)
    } catch (error) {
      next(error)
    }
  }
}

export const searchController = new SearchController()
