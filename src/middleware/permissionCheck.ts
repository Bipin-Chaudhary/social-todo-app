import { Request, Response, NextFunction } from 'express'
import { claimCheck } from 'express-openid-connect'

import responseMessages from '../utils/responseMessages'
import statusCode from '../utils/statusCode'

// [edit:user]

export default (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('in permission check')
    const permissionCheck = claimCheck((req, claims):any => {
      const permissions = (claims?.socialTodoAppPermission as any)?.permissions as string[]

      console.log({ permissions })
      const hasPermissions = requiredPermissions.every((requiredPermission) => permissions.includes(requiredPermission))

      console.log({ hasPermissions })
      if (!hasPermissions) {
        return res.status(statusCode.Unauthorized).json({
          message: responseMessages.accessDenied
        })
      }

      console.log('after return')

      return hasPermissions
    })

    return permissionCheck(req, res, next)
  }
}
