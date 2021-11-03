import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GroupService } from 'src/group/group.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly groupService: GroupService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    const request = context.switchToHttp().getRequest();

    const user = request.user; // Get User information from Request.
    const paramsId: string = request.params.id; // Get Route parameter ID from Request.
    let userRole = null;

    // Check if user has a globalManager role then allow to access the route.
    for (const element of user.roles) {
      if (element.role.toLowerCase() === 'globalmanager') {
        userRole = element;
        break;
      }
    }

    // If User doesn't have globalManager role then check it's role permission.
    if (!userRole) {
      // Get Group IDs which is assigned to a User.
      const groupIds = user.roles.map(e => e.groupId);

      // Get All the groups which is assigned to a user.
      const userGroups = await this.groupService.getGroupByIds(groupIds);
      let currentGroupId = null;

      // Iterate user assigned groups.
      for (const element of userGroups) {
         // Check if ID provided in param exist in user permissions list.
        if (element.collectionIds.includes(paramsId)) {
          currentGroupId = element._id;
          break;
        }
      }

      // Check type of role user has in provided Collection ID provided in Params.
      for (const element of user.roles) {
        if (element.groupId.toString() == currentGroupId.toString()) {
          userRole = element;
          break;
        }
      }
    }

    // Returns user permission in Boolean.
    return roles.includes(userRole?.role.toLowerCase());
  }
}
